import type { DataTable } from '@cucumber/cucumber';
import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { CustomWorld } from '../support/world.js';

Given(
  'que eu estou logado como uma empresa com ID {string}',
  function (this: CustomWorld, empresaId: string) {
    this.authToken = 'mock-token'; // Simulando autenticação
    this.empresaId = empresaId;
  },
);

Given('que eu tenho os detalhes do produto:', function (this: CustomWorld, data: DataTable) {
  const details = data.rowsHash();
  this.payload = {
    ...details,
    preco: parseFloat(details.preco),
    estoque: parseInt(details.estoque),
    empresaId: this.empresaId,
  };
});

Then(
  'o corpo da resposta deve conter o título {string}',
  function (this: CustomWorld, expectedTitle: string) {
    const body = this.lastResponse.body as Record<string, unknown>;
    expect(body.titulo).to.equal(expectedTitle);
  },
);

Given('que existem produtos cadastrados no sistema', function (this: CustomWorld) {
  expect(this.app).to.not.be.equal(undefined);
});

Then('a resposta deve conter uma lista de produtos', function (this: CustomWorld) {
  expect(Array.isArray(this.lastResponse.body)).to.be.equal(true);
});

Given(
  'que existem produtos da categoria {string}',
  function (this: CustomWorld, categoria: string) {
    expect(categoria).to.not.be.equal(undefined);
  },
);

Then(
  'todos os produtos retornados devem ser da categoria {string}',
  function (this: CustomWorld, categoria: string) {
    const products = this.lastResponse.body as Record<string, unknown>[];
    if (products.length > 0) {
      products.forEach((p) => {
        expect(p.categoria).to.equal(categoria);
      });
    }
  },
);
