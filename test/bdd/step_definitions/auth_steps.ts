import type { DataTable } from '@cucumber/cucumber';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import type { Response } from 'supertest';
import type { CustomWorld } from '../support/world.js';

Given('que eu tenho os dados de um novo produtor:', function (this: CustomWorld, data: DataTable) {
  this.payload = data.rowsHash();
});

Given('que eu tenho os dados de um novo comprador:', function (this: CustomWorld, data: DataTable) {
  this.payload = data.rowsHash();
});

When(
  'eu envio uma requisição POST para {string} com esses dados',
  async function (this: CustomWorld, path: string) {
    this.lastResponse = (await request(this.server).post(path).send(this.payload)) as Response;
  },
);

Then('a resposta deve conter o UID do usuário criado', function (this: CustomWorld) {
  const body = this.lastResponse.body as Record<string, unknown>;
  expect(body).to.have.property('uid');
});
