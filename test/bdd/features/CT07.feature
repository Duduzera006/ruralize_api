# language: pt

Funcionalidade: Avaliação de Produto

    Cenário: Publicar avaliação de produto
        Dado que o usuário está logado
        E existe pelo menos um produto disponível
        Quando acessa a página inicial
        E seleciona um produto
        E insere uma avaliação
        E publica a avaliação
        Então a avaliação deve ser registrada
        E a avaliação deve ser exibida