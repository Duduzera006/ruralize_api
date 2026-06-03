# language: pt

Funcionalidade: Avaliações e Favoritos
  Como um comprador
  Eu quero avaliar produtos e salvar meus favoritos
  Para compartilhar minha experiência e facilitar compras futuras

  Cenário: Enviar uma avaliação de produto
    Dado que eu tenho os dados de uma avaliação:
      | empresaId | empresa-123 |
      | productId | prod-789    |
      | buyerId   | comprador-1 |
      | rating    | 5           |
      | comment   | Excelente produto! |
    Quando eu envio uma requisição POST para "/reviews" com esses dados
    Então o status da resposta deve ser 201
    E a avaliação deve ser salva com sucesso

  Cenário: Adicionar produto aos favoritos
    Dado que eu tenho os dados para favoritar:
      | buyerId   | comprador-1 |
      | empresaId | empresa-123 |
      | productId | prod-789    |
    Quando eu envio uma requisição POST para "/favorites" com esses dados
    Então o status da resposta deve ser 201
    E a resposta deve confirmar a adição aos favoritos
