import * as K from './src/graph_kernel.mjs';
import { PolicyPlayer } from './sim_player.mjs';
const DT = 1 / 60;
const seed = Number(process.argv[2] || 11);
const seconds = Math.min(8, Math.max(1, Number(process.argv[3] || 6)));
const skill = Number(process.argv[4] || 1);
const world = K.createWorld({ seed, fresh: true });
const player = new PolicyPlayer(K, { seed, skill });
const frames = Math.round(seconds * 60);
const nodes = new Set();
let alive = true;
for (let i = 0; i < frames; i++) {
  if (!player.maybeShop(world)) {
    const cmd = player.update(world, DT);
    K.step(world, cmd, DT);
  }
  nodes.add(player.node);
  if (!K.getPlayer(world)) { alive = false; break; }
}
const p = K.getPlayer(world);
console.log('RESULT ' + JSON.stringify({
  seed, seconds, skill, frames, nodes: [...nodes], node: player.node,
  alive, t: world.t, buys: player._buys || 0, hp: p ? p.hp : 0
}));
