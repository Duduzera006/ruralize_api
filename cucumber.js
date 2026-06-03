export default {
  paths: ['test/bdd/features/**/*.feature'],
  import: ['test/bdd/step_definitions/**/*.ts', 'test/bdd/support/**/*.ts'],
  loader: ['ts-node/esm'],
  format: ['progress-bar', 'summary', 'progress'],
  parallel: 1,
};
