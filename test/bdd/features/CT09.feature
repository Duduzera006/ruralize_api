# language: pt

Funcionalidade: Realização de Compra

    Cenário: Tentativa de compra com dados de pagamento inválidos
        Dado que o usuário está logado
        E possui pelo menos um produto no carrinho
        Quando prossegue para pagamento
        E deixa campos obrigatórios em branco
        E confirma o pedido
        Então o sistema deve exibir uma mensagem de erro
        E a compra não deve ser finalizada