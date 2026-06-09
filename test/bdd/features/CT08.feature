# language: pt

Funcionalidade: Cadastro de Usuário

    Cenário: Tentativa de cadastro com dados inválidos
        Dado que o usuário está na página de cadastro
        Quando deixa campos obrigatórios em branco
        E clica em "Criar Conta"
        Então o sistema deve exibir uma mensagem de erro
        E o cadastro não deve ser realizado