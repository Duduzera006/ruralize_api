# language: pt

Funcionalidade: Login de Usuário

    Cenário: Login com credenciais válidas
        Dado que existe um usuário cadastrado
        E está na página de login
        Quando informa credenciais válidas
        E clica em "Fazer Login"
        Então o login deve ser realizado com sucesso
        E o usuário deve ser redirecionado para a página inicial