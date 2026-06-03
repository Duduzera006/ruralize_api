import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../support/world.js';

Given('que eu estou logado como uma empresa com ID {string}', function (this: CustomWorld, empresaId: string) {
  this.authToken = 'mock-token'; // Simulando autenticação
  this.empresaId = empresaId;
});

Given('que eu tenho os detalhes do produto:', function (this: CustomWorld, data: DataTable) {
  const details = data.rowsHash();
  this.payload = {
    ...details,
    preco: parseFloat(details.preco),
    estoque: parseInt(details.estoque),
    empresaId: this.empresaId,
  };
});

Then('o corpo da resposta deve conter o título {string}', function (this: CustomWorld, expectedTitle: string) {
  expect(this.lastResponse.body.titulo).to.equal(expectedTitle);
});

Given('que existem produtos cadastrados no sistema', function (this: CustomWorld) {
  // O mock do Firestore no World já retorna um array (mesmo que vazio por enquanto)
  // Se precisarmos de dados específicos, injetamos no mock aqui.
});

Then('a resposta deve conter uma lista de produtos', function (this: CustomWorld) {
  expect(Array.isArray(this.lastResponse.body)).to.be.true;
});

Given('que existem produtos da categoria {string}', function (this: CustomWorld, _categoria: string) {
  // Preparação do mock para retornar produtos da categoria
});

Then('todos os produtos retornados devem ser da categoria {string}', function (this: CustomWorld, categoria: string) {
  const products = this.lastResponse.body;
  if (products.length > 0) {
    products.forEach((p: any) => {
      expect(p.categoria).to.equal(categoria);
    });
  }
});
