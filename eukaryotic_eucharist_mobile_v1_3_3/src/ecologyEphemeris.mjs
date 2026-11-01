// A tiny online world-model for the autonomous ecology.
//
// Umwelt's useful abstraction here is not its Python/quantum implementation; that was
// slower than persistence on most exported EE signals.  It is the contract: observations
// become beliefs with uncertainty, beliefs are rolled forward, and a forecast only earns
// influence after beating the horizon-zero ("nothing changes") forecast.  This module is
// intentionally pure and serializable so the browser, headless lab, and save/debug tooling
// all see the same state.

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const emaAlpha = (dt, tau) => 1 - Math.exp(-dt / Math.max(1e-6, tau));

export const EPHEMERIS_SIGNALS = Object.freeze([
  'prey', 'carrion', 'producer', 'predators', 'hunterEnergy', 'hunterHeat', 'predatorFlux',
  'woundPulse', 'deepBloomBirth', 'hunterFission', 'hunterIn', 'hunterOut'
]);

const SIGNAL_FLOORS = Object.freeze({
  prey: 2, carrion: 0.12, producer: 0.12, predators: 1,
  hunterEnergy: 0.04, hunterHeat: 0.04, predatorFlux: 0.04,
  woundPulse: 0.08, deepBloomBirth: 0.08, hunterFission: 0.08, hunterIn: 0.08, hunterOut: 0.08
});

function makeLeaf(value, floor) {
  return {
    level: value,
    center: value,
    velocity: 0,
    scale: Math.max(floor, Math.abs(value) * 0.08),
    surprise: 0,
    forecastMae: 0,
    persistenceMae: 0,
    trust: 0,
    scored: 0
  };
}

export function createEcologyEphemeris(observation, options = {}) {
  const leaves = {};
  for (const name of EPHEMERIS_SIGNALS) {
    const value = Number(observation?.[name]) || 0;
    leaves[name] = makeLeaf(value, SIGNAL_FLOORS[name]);
  }
  return {
    mode: options.mode || 'belief',
    samplePeriod: clamp(Number(options.samplePeriod) || 1, 0.25, 4),
    horizon: clamp(Number(options.horizon) || 12, 3, 40),
    elapsed: 0,
    lastSampleTime: Number(options.now) || 0,
    leaves,
    pending: [],
    driver: 0,
    multiplier: 1,
    confidence: 0,
    surprise: 0,
    opportunity: 0,
    eventDrive: 0,
    phase: 0,
    period: 0,
    lastRisingCross: null,
    crossings: 0,
    updates: 0
  };
}

function scoreDueForecasts(state, observation, now) {
  let consume = 0;
  while (consume < state.pending.length && state.pending[consume].due <= now + 1e-9) {
    const ticket = state.pending[consume++];
    for (const name of EPHEMERIS_SIGNALS) {
      const leaf = state.leaves[name];
      const actual = Number(observation[name]) || 0;
      const fErr = Math.abs(actual - ticket.forecast[name]);
      const pErr = Math.abs(actual - ticket.persistence[name]);
      const a = emaAlpha(state.samplePeriod, 45);
      leaf.forecastMae += (fErr - leaf.forecastMae) * a;
      leaf.persistenceMae += (pErr - leaf.persistenceMae) * a;
      leaf.scored++;
      // Exactly equal zero-errors contain no evidence. Otherwise 0.5 is parity,
      // >0.5 means the world-model beats persistence, and <0.5 prunes it.
      const total = leaf.forecastMae + leaf.persistenceMae;
      leaf.trust = total > 1e-9 ? leaf.persistenceMae / total : 0;
    }
  }
  if (consume) state.pending.splice(0, consume);
}

function forecastLeaf(leaf, horizon) {
  // A robust constant-velocity rollout. The velocity cap prevents a single rupture
  // pulse from projecting an impossible population explosion into the future.
  const travel = clamp(leaf.velocity * horizon, -2.5 * leaf.scale, 2.5 * leaf.scale);
  return leaf.level + travel;
}

function zFuture(leaf, horizon) {
  return clamp((forecastLeaf(leaf, horizon) - leaf.center) / Math.max(1e-6, leaf.scale), -3, 3);
}

function predictiveConfidence(state) {
  // The driver depends mostly on trophic stocks; ATP/heat/flux are supporting context.
  const weights = {
    prey: 1, carrion: 0.55, producer: 0.35, predators: 0.9,
    hunterEnergy: 0.25, hunterHeat: 0.3, predatorFlux: 0.2,
    woundPulse: 0.25, deepBloomBirth: 0.2, hunterFission: 0.3, hunterIn: 0.15, hunterOut: 0.15
  };
  let sum = 0, weight = 0;
  for (const name of EPHEMERIS_SIGNALS) {
    const leaf = state.leaves[name];
    if (leaf.scored < 3) continue;
    // Influence begins only above persistence parity and reaches 1 at trust=.75.
    const earned = clamp((leaf.trust - 0.5) * 4, 0, 1);
    sum += earned * weights[name];
    weight += weights[name];
  }
  return weight ? sum / weight : 0;
}

export function updateEcologyEphemeris(state, observation, now, gain = 0.5, eventGain = 0.7) {
  if (!state || !observation) return state;
  const dt = clamp(now - state.lastSampleTime || state.samplePeriod, 0.05, 8);
  scoreDueForecasts(state, observation, now);

  const forecasts = {}, persistence = {};
  let surprise = 0;
  for (const name of EPHEMERIS_SIGNALS) {
    const leaf = state.leaves[name];
    const observed = Number(observation[name]) || 0;
    const prior = leaf.level + leaf.velocity * dt;
    const innovation = observed - prior;
    const oldLevel = leaf.level;

    // Two time scales create a belief rather than a raw derivative: a responsive
    // local state and a slow ecological climate used as the moving origin.
    leaf.level = prior + innovation * emaAlpha(dt, 7);
    leaf.velocity += innovation / dt * emaAlpha(dt, 18);
    leaf.center += (observed - leaf.center) * emaAlpha(dt, 110);
    const residual = Math.abs(observed - leaf.level);
    leaf.scale += (Math.max(SIGNAL_FLOORS[name], residual, Math.abs(observed - oldLevel) * 0.35) - leaf.scale)
      * emaAlpha(dt, 35);
    leaf.velocity = clamp(leaf.velocity, -leaf.scale * 0.3, leaf.scale * 0.3);
    leaf.surprise += (residual / Math.max(SIGNAL_FLOORS[name], leaf.scale) - leaf.surprise)
      * emaAlpha(dt, 12);
    surprise += clamp(leaf.surprise, 0, 3);
    forecasts[name] = forecastLeaf(leaf, state.horizon);
    persistence[name] = observed;
  }

  state.pending.push({ due: now + state.horizon, forecast: forecasts, persistence });
  // Bound memory even if a caller jumps time or changes horizons.
  if (state.pending.length > Math.ceil(state.horizon / state.samplePeriod) + 8) state.pending.shift();

  const z = name => zFuture(state.leaves[name], state.horizon);
  const presentZ = name => clamp((state.leaves[name].level - state.leaves[name].center)
    / Math.max(1e-6, state.leaves[name].scale), -3, 3);
  // Event leaves are sparse non-negative counts. "No rupture this second" is neutral, not negative
  // evidence relative to a months-long average; subtracting a slow center created an artificial,
  // sticky refractory winter after every outbreak. Explicit opposing events (exodus) provide the
  // negative evidence instead.
  const eventZ = name => clamp(state.leaves[name].level / Math.max(1e-6, state.leaves[name].scale), 0, 3);
  // A forecast of ecological opportunity, not a population target. Abundant/rising
  // prey and producer matter pull migrant hunters in; an already-hot, growing resident
  // guild and positive inbound flux push the tide back out. Delays in those coupled
  // stocks supply the possible oscillation; there is no authored period.
  const opportunity = 0.62 * z('prey') + 0.25 * z('carrion') + 0.18 * z('producer')
    - 0.58 * z('predators') - 0.18 * z('hunterEnergy') - 0.24 * z('hunterHeat')
    - 0.12 * z('predatorFlux');
  const confidence = predictiveConfidence(state);
  // Horizon-zero Umwelt: discrete ecological events are exact observations even when
  // their future *level* is not forecastable. A wound/rupture/fission pulse leaves a
  // decaying scent-memory; crowding, heat, and outbound migration oppose it. This is a
  // continuous convolution of evidence, not an event threshold or scripted season.
  const eventOpportunity = 0.48 * eventZ('woundPulse') + 0.30 * eventZ('deepBloomBirth')
    + 0.38 * eventZ('hunterFission') + 0.14 * eventZ('hunterIn')
    - 0.25 * eventZ('hunterOut') - 0.34 * Math.max(0, presentZ('predators'))
    - 0.18 * Math.max(0, presentZ('hunterHeat'));
  const sensedEventDrive = Math.tanh(eventOpportunity * 0.55);
  state.eventDrive += (sensedEventDrive - state.eventDrive) * emaAlpha(dt, 9);
  const targetDriver = clamp(Math.tanh(opportunity * 0.55) * confidence
    + state.eventDrive * clamp(eventGain, 0, 3), -1, 1);
  state.driver += (targetDriver - state.driver) * emaAlpha(dt, 6);
  state.multiplier = clamp(1 + clamp(gain, 0, 0.9) * state.driver, 0.35, 1.9);
  state.confidence = confidence;
  state.surprise = surprise / EPHEMERIS_SIGNALS.length;
  state.opportunity = opportunity;

  // Diagnostic phase only: a delay embedding of opportunity and its smoothed
  // derivative. It measures irregular lap times but never drives the ecology.
  const previousPhase = state.phase;
  state.phase = Math.atan2(state.driver - (state._previousDriver || 0), state.driver || 1e-9);
  state._previousDriver = state.driver;
  if (state.driver > 0 && state._previousSignedDriver <= 0) {
    if (state.lastRisingCross != null) {
      const lap = now - state.lastRisingCross;
      if (lap >= 8) state.period = state.period ? state.period + (lap - state.period) * 0.25 : lap;
    }
    state.lastRisingCross = now;
    state.crossings++;
  }
  state._previousSignedDriver = state.driver;
  state._phaseVelocity = state.phase - previousPhase;
  state.lastSampleTime = now;
  state.updates++;
  return state;
}

export function ephemerisSnapshot(state) {
  if (!state) return null;
  const trust = {}, forecastSkill = {};
  for (const name of EPHEMERIS_SIGNALS) {
    const leaf = state.leaves[name];
    trust[name] = leaf.trust;
    forecastSkill[name] = leaf.persistenceMae > 1e-9
      ? 1 - leaf.forecastMae / leaf.persistenceMae
      : 0;
  }
  return {
    mode: state.mode,
    driver: state.driver,
    multiplier: state.multiplier,
    confidence: state.confidence,
    surprise: state.surprise,
    opportunity: state.opportunity,
    eventDrive: state.eventDrive,
    phase: state.phase,
    period: state.period,
    crossings: state.crossings,
    updates: state.updates,
    trust,
    forecastSkill
  };
}
