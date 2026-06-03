# language: pt

Funcionalidade: Gestão de Pedidos e Estoque
  Como o sistema Ruralize
  Eu quero garantir a integridade das vendas e do estoque
  Para evitar problemas de logística e inventário

  Contexto:
    Dado que existe um produto cadastrado:
      | id        | prod-123           |
      | titulo    | Sela de Couro       |
      | estoque   | 5                  |
      | empresaId | empresa-456         |

  Cenário: Realização de pedido com estoque disponível
    Quando eu envio uma requisição POST para "/orders" com os itens:
      | productId | prod-123 |
      | quantidade | 2        |
      | empresaId  | empresa-456 |
      | total      | 500.00      |
    Então o status da resposta deve ser 201
    E a resposta deve conter a confirmação do pedido

  Cenário: Falha ao realizar pedido com estoque insuficiente
    Quando eu envio uma requisição POST para "/orders" com os itens:
      | productId | prod-123 |
      | quantidade | 10       |
      | empresaId  | empresa-456 |
      | total      | 2500.00     |
    Então o status da resposta deve ser 400
    E o corpo da resposta deve conter a mensagem de erro "Estoque insuficiente"
