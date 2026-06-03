# language: pt

Funcionalidade: Autenticação de Usuários
  Como o sistema Ruralize
  Eu quero gerenciar o cadastro de empresas e compradores
  Para garantir o acesso seguro à plataforma

  Cenário: Cadastro de um novo Produtor com CNPJ válido
    Dado que eu tenho os dados de um novo produtor:
      | email          | produtor@teste.com |
      | password       | 123456            |
      | displayName    | Fazenda Feliz      |
      | cnpj           | 11444777000161 |
    Quando eu envio uma requisição POST para "/auth/signup" com esses dados
    Então o status da resposta deve ser 201
    E a resposta deve conter o UID do usuário criado

  Cenário: Cadastro de um Comprador sem CNPJ
    Dado que eu tenho os dados de um novo comprador:
      | email          | comprador@teste.com |
      | password       | 123456             |
      | displayName    | Joao Silva         |
    Quando eu envio uma requisição POST para "/auth/signup" com esses dados
    Então o status da resposta deve ser 201
    E a resposta deve conter o UID do usuário criado

  Cenário: Falha ao cadastrar Produtor com CNPJ inválido
    Dado que eu tenho os dados de um novo produtor:
      | email          | erro@teste.com |
      | password       | 123456        |
      | displayName    | Fazenda Erro   |
      | cnpj           | 00.000.000/0000-00 |
    Quando eu envio uma requisição POST para "/auth/signup" com esses dados
    Então o status da resposta deve ser 400
