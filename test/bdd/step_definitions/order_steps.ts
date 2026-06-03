import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world.js';

Given('que existe um produto cadastrado:', function (this: CustomWorld, data: DataTable) {
  const product = data.rowsHash();
  this.productData = {
    ...product,
    estoque: parseInt(product.estoque),
  };
  // No mundo real, aqui injetaríamos isso no mock do Firestore
});

When('eu envio uma requisição POST para {string} com os itens:', async function (this: CustomWorld, path: string, data: DataTable) {
  const row = data.rowsHash();
  const payload = {
    empresaId: row.empresaId,
    total: parseFloat(row.total),
    items: [
      {
        productId: row.productId,
        quantidade: parseInt(row.quantidade),
      }
    ],
    pagamento: { metodo: 'pix' },
    entrega: { tipo: 'entrega', endereco: 'Rua de Teste' }
  };
  
  this.lastResponse = await request(this.app.getHttpServer())
    .post(path)
    .send(payload);
});

Then('a resposta deve conter a confirmação do pedido', function (this: CustomWorld) {
  expect(this.lastResponse.body).to.have.property('id');
});

Then('o corpo da resposta deve conter a mensagem de erro {string}', function (this: CustomWorld, expectedMsg: string) {
  const message = JSON.stringify(this.lastResponse.body);
  expect(message.toLowerCase()).to.contain(expectedMsg.toLowerCase());
});
