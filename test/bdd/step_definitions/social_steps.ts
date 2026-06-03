import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../support/world.js';

Given('que eu tenho os dados de uma avaliação:', function (this: CustomWorld, data: DataTable) {
  const row = data.rowsHash();
  this.payload = {
    ...row,
    rating: parseInt(row.rating),
  };
});

Then('a avaliação deve ser salva com sucesso', function (this: CustomWorld) {
  expect(this.lastResponse.body).to.have.property('id');
});

Given('que eu tenho os dados para favoritar:', function (this: CustomWorld, data: DataTable) {
  this.payload = data.rowsHash();
});

Then('a resposta deve confirmar a adição aos favoritos', function (this: CustomWorld) {
  expect(this.lastResponse.body.success).to.be.true;
});
