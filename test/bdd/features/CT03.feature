# language: pt

Funcionalidade: Edição de Dados Cadastrais

    Cenário: Alteração de nome de usuário
        Dado que o usuário está logado
        E está na página de perfil
        Quando altera o nome de usuário
        E salva as alterações
        Então os dados devem ser atualizados no sistema