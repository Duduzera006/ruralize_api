# language: pt

Funcionalidade: Favoritar Produto

    Cenário: Adicionar produto aos favoritos
        Dado que o usuário está logado
        E existe pelo menos um produto disponível
        Quando acessa a página inicial
        E clica no ícone de favorito de um produto
        Então o produto deve ser adicionado à lista de favoritos