// graph_kernel.mjs — public barrel. Behavior-preserving split:
//   simCore.mjs   — the lean, headless-importable ecology sim (createWorld/step/stepEcology/systemMatter/signature + data)
//   gameModule.mjs — shop / Yuki / HUD-render-debug projections (imports from simCore)
// Re-exports both so every existing importer of graph_kernel.mjs keeps working unchanged (incl. __test).
export * from './simCore.mjs';
export * from './gameModule.mjs';
