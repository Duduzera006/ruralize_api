# language: pt

Funcionalidade: Gestão Logística (Entregas)
  Como um vendedor
  Eu quero gerenciar as entregas dos meus pedidos
  Para manter o cliente informado sobre o status do envio

  Contexto:
    Dado que eu estou logado como uma empresa com ID "vendedor-456"

  Cenário: Criação de uma nova entrega
    Dado que eu tenho os dados de uma entrega:
      | orderId    | order-001 |
      | endereco   | Avenida Brasil, 100 |
      | prazo      | 3 dias úteis |
    Quando eu envio uma requisição POST para "/deliveries" com esses dados
    Então o status da resposta deve ser 201
    E a entrega deve ter o status "PENDENTE"

  Cenário: Atualização de status da entrega
    Dado que existe uma entrega com ID "delivery-789"
    Quando eu envio uma requisição PATCH para "/deliveries/vendedor-456/delivery-789" com:
      | status | EM_TRANSITO |
    Então o status da resposta deve ser 200
    E a entrega deve estar com o status "EM_TRANSITO"
