# language: pt

Funcionalidade: Catálogo de Produtos
  Como uma empresa rural
  Eu quero gerenciar meus produtos na plataforma
  Para que compradores possam encontrá-los

  Contexto:
    Dado que eu estou logado como uma empresa com ID "empresa-123"

  Cenário: Cadastro de um novo produto
    Dado que eu tenho os detalhes do produto:
      | titulo    | Ração para Cavalos |
      | descricao | Saco de 20kg      |
      | preco     | 150.50             |
      | estoque   | 10                 |
      | categoria | Rações e Concentrados |
    Quando eu envio uma requisição POST para "/products" com esses dados
    Então o status da resposta deve ser 201
    E o corpo da resposta deve conter o título "Ração para Cavalos"

  Cenário: Listagem de todos os produtos
    Dado que existem produtos cadastrados no sistema
    Quando eu faço uma requisição GET para "/products"
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de produtos

  Cenário: Busca de produtos por categoria
    Dado que existem produtos da categoria "Rações e Concentrados"
    Quando eu faço uma requisição GET para "/products?categoria=Rações%20e%20Concentrados"
    Então o status da resposta deve ser 200
    E todos os produtos retornados devem ser da categoria "Rações e Concentrados"
