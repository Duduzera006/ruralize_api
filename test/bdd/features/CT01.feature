# language: pt

Funcionalidade: Cadastro de Consumidor

    Cenário: Cadastro de consumidor com dados válidos
        Dado que o usuário não possui cadastro
        E está na página de cadastro
        Quando informa dados válidos
        E clica em "Criar Conta"
        Então a conta deve ser criada com sucesso
        E o usuário deve ser redirecionado para a página inicial