import { Before, After } from '@cucumber/cucumber';
import type { CustomWorld } from './world.js';

Before(async function (this: CustomWorld) {
  await this.initApp();
});

After(async function (this: CustomWorld) {
  if (this.app) {
    await this.app.close();
  }
});
