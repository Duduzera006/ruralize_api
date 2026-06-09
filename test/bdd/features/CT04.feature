# language: pt

Funcionalidade: Realização de Compra

    Cenário: Compra de produto com sucesso
        Dado que o usuário está logado
        E existe pelo menos um produto disponível
        Quando acessa a página inicial
        E seleciona um produto
        E adiciona o produto ao carrinho
        E prossegue para pagamento
        E informa os dados necessários
        E confirma o pedido
        Então a compra deve ser registrada
        E o sistema deve exibir uma mensagem de sucesso