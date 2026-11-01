import {
  createEcologyEphemeris, updateEcologyEphemeris, ephemerisSnapshot
} from './src/ecologyEphemeris.mjs';

const assert = (ok, message) => { if (!ok) throw new Error(message); };
const row = t => ({
  prey: 40 + t * 0.7,
  carrion: 8 + t * 0.035,
  producer: 7 + t * 0.02,
  predators: 15 + t * 0.08,
  hunterEnergy: 0.3 + t * 0.001,
  hunterHeat: 0.2 + t * 0.001,
  predatorFlux: 0,
  woundPulse: 0, deepBloomBirth: 0, hunterFission: 0, hunterIn: 0, hunterOut: 0
});

const state = createEcologyEphemeris(row(0), { horizon: 6, samplePeriod: 1 });
for (let t = 1; t <= 80; t++) updateEcologyEphemeris(state, row(t), t, 0.5);
const result = ephemerisSnapshot(state);
assert(result.updates === 80, 'each synthetic observation updates the ephemeris');
assert(result.forecastSkill.prey > 0, 'trend belief beats persistence on a smooth prey ramp');
assert(result.confidence > 0, 'verified forecasts earn nonzero confidence');
assert(result.multiplier >= 0.5 && result.multiplier <= 1.5, 'default gain bounds the ephemeris influence');

const still = { ...row(0), prey: 40, carrion: 8, producer: 7, predators: 15,
  hunterEnergy: 0.3, hunterHeat: 0.2 };
const eventState = createEcologyEphemeris(still, { horizon: 6, samplePeriod: 1 });
for (let t = 1; t <= 24; t++) updateEcologyEphemeris(eventState, still, t, 0.5);
for (let t = 25; t <= 30; t++) updateEcologyEphemeris(eventState,
  { ...still, woundPulse: 3, hunterFission: 1 }, t, 0.5);
const eventResult = ephemerisSnapshot(eventState);
assert(eventResult.eventDrive > 0, 'wound and successful-cleave evidence creates a positive scent-memory');
assert(eventResult.multiplier > 1, 'event belief gently raises migration demand without commanding a spawn');
console.log('EPHEMERIS_OK', JSON.stringify(result));
