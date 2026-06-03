import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world.js';

Given('que a API está rodando', function (this: CustomWorld) {
  expect(this.app).to.not.be.undefined;
});

When('eu faço uma requisição GET para {string}', async function (this: CustomWorld, path: string) {
  this.lastResponse = await request(this.app.getHttpServer()).get(path);
});

Then('o status da resposta deve ser {int}', function (this: CustomWorld, statusCode: number) {
  if (this.lastResponse.status !== statusCode) {
    console.error('Erro inesperado:', JSON.stringify(this.lastResponse.body, null, 2));
  }
  expect(this.lastResponse.status).to.equal(statusCode);
});

Then('o corpo da resposta deve ser {string}', function (this: CustomWorld, expectedBody: string) {
  expect(this.lastResponse.text).to.equal(expectedBody);
});
