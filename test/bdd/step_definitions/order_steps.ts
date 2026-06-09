import type { DataTable } from '@cucumber/cucumber';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import type { Response } from 'supertest';
import type { CustomWorld, App } from '../support/world.js';

Given('que existe um produto cadastrado:', function (this: CustomWorld, data: DataTable) {
  const product = data.rowsHash();
  this.productData = {
    ...product,
    estoque: parseInt(product.estoque),
  };
});

When(
  'eu envio uma requisição POST para {string} com os itens:',
  async function (this: CustomWorld, path: string, data: DataTable) {
    const row = data.rowsHash();
    const payload = {
      empresaId: row.empresaId,
      total: parseFloat(row.total),
      items: [
        {
          productId: row.productId,
          quantidade: parseInt(row.quantidade),
        },
      ],
      pagamento: { metodo: 'pix' },
      entrega: { tipo: 'entrega', endereco: 'Rua de Teste' },
    };

    const server = this.app.getHttpServer() as App;
    this.lastResponse = (await request(server).post(path).send(payload)) as Response;
  },
);

Then('a resposta deve conter a confirmação do pedido', function (this: CustomWorld) {
  const body = this.lastResponse.body as Record<string, unknown>;
  expect(body).to.have.property('id');
});

Then(
  'o corpo da resposta deve conter a mensagem de erro {string}',
  function (this: CustomWorld, expectedMsg: string) {
    const message = JSON.stringify(this.lastResponse.body);
    expect(message.toLowerCase()).to.contain(expectedMsg.toLowerCase());
  },
);
