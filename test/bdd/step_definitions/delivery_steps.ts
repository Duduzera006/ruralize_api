import type { DataTable } from '@cucumber/cucumber';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import type { Response } from 'supertest';
import type { CustomWorld } from '../support/world.js';

Given('que eu tenho os dados de uma entrega:', function (this: CustomWorld, data: DataTable) {
  this.payload = {
    ...data.rowsHash(),
    empresaId: this.empresaId,
  };
});

Then('a entrega deve ter o status {string}', function (this: CustomWorld, expectedStatus: string) {
  const body = this.lastResponse.body as Record<string, unknown>;
  expect(body.status).to.equal(expectedStatus);
});

Given('que existe uma entrega com ID {string}', function (this: CustomWorld, deliveryId: string) {
  expect(deliveryId).to.not.be.equal(undefined);
});

When(
  'eu envio uma requisição PATCH para {string} com:',
  async function (this: CustomWorld, path: string, data: DataTable) {
    this.lastResponse = (await request(this.server).patch(path).send(data.rowsHash())) as Response;
  },
);

Then(
  'a entrega deve estar com o status {string}',
  function (this: CustomWorld, expectedStatus: string) {
    expect(expectedStatus).to.not.be.equal(undefined);
    expect(this.lastResponse.status).to.equal(200);
  },
);
