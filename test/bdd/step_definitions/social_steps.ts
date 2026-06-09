import type { DataTable } from '@cucumber/cucumber';
import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { CustomWorld } from '../support/world.js';

Given('que eu tenho os dados de uma avaliação:', function (this: CustomWorld, data: DataTable) {
  const row = data.rowsHash();
  this.payload = {
    ...row,
    rating: parseInt(row.rating),
  };
});

Then('a avaliação deve ser salva com sucesso', function (this: CustomWorld) {
  const body = this.lastResponse.body as Record<string, unknown>;
  expect(body).to.have.property('id');
});

Given('que eu tenho os dados para favoritar:', function (this: CustomWorld, data: DataTable) {
  this.payload = data.rowsHash();
});

Then('a resposta deve confirmar a adição aos favoritos', function (this: CustomWorld) {
  const body = this.lastResponse.body as Record<string, unknown>;
  expect(body.success).to.be.equal(true);
});
