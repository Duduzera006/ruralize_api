# language: pt

Funcionalidade: Conversar com Fornecedor

    Cenário: Enviar mensagem ao fornecedor
        Dado que o usuário está logado
        E existe pelo menos um produto disponível
        Quando acessa a página inicial
        E seleciona um produto
        E abre a caixa de diálogo com o fornecedor
        E digita uma mensagem
        E envia a mensagem
        Então a mensagem deve ser encaminhada ao fornecedor