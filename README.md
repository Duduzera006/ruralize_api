<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
<a href="https://firebase.google.com/" target="blank"><img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="120" alt="Firebase Logo" /></a>
</p>

<h1 align="center">API REST | NestJS & Firebase</h1>
  <p align="center">
Uma API robusta construída com NestJS e Firebase para suportar aplicações web e mobile.
</p>

🚀 Sobre o Projeto
Este repositório contém o código-fonte de uma API REST desenvolvida com NestJS, um framework progressivo para aplicações Node.js, e o Firebase como serviço de backend. A API foi projetada para ser a espinha dorsal de um sistema que inclui:

Sistema Web: Desenvolvido em Next.js (separado).

Aplicação Mobile: Desenvolvida em Java para Android (separado).

🛠️ Tecnologias Utilizadas
NestJS: Um framework poderoso para a criação de aplicações Node.js eficientes e escaláveis.

TypeScript: Uma linguagem que adiciona tipagem estática ao JavaScript.

Firebase: Um conjunto de ferramentas do Google que oferece serviços de backend como autenticação, banco de dados (Firestore/Realtime Database), e armazenamento de arquivos (Cloud Storage).

⚙️ Configuração do Projeto
Para começar a trabalhar com a API, siga as instruções abaixo.

Pré-requisitos
Certifique-se de ter o Node.js e o npm (ou yarn) instalados em sua máquina.

Instalação
Bash

# 1. Clone este repositório
$ git clone https://github.com/Duduzera006/ruralize_api.git

# 2. Navegue até o diretório do projeto
$ cd ruralize_api

# 3. Instale as dependências
$ npm install
Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias para a conexão com o Firebase. O arquivo pode ser semelhante a:

FIREBASE_API_KEY=sua-api-key
FIREBASE_AUTH_DOMAIN=seu-auth-domain.firebaseapp.com
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_STORAGE_BUCKET=seu-storage-bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
FIREBASE_APP_ID=seu-app-id
Execução
Bash

# Modo de desenvolvimento
$ npm run start:dev

# Modo de produção
$ npm run start:prod
A API estará disponível em http://localhost:3000 (ou na porta configurada).

📄 Licença
Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo LICENSE.