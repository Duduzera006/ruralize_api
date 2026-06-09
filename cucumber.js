export default {
  import: ['test/bdd/step_definitions/**/*.ts', 'test/bdd/support/**/*.ts'],
  loader: ['ts-node/esm'],
  format: ['cucumber-console-formatter'],
  parallel: 1,
};
