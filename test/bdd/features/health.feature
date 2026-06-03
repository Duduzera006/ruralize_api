# language: pt

Funcionalidade: Health Check da API
  Como um desenvolvedor
  Eu quero verificar se a API está respondendo corretamente
  Para garantir a estabilidade do sistema

  Cenário: Verificar endpoint raiz
    Dado que a API está rodando
    Quando eu faço uma requisição GET para "/"
    Então o status da resposta deve ser 200
    E o corpo da resposta deve ser "Hello World!"
