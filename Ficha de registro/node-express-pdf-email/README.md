# Node Express PDF Email

Este projeto é uma aplicação Node.js utilizando Express para permitir o upload de arquivos PDF e o envio desses arquivos por e-mail utilizando SMTP.

## Estrutura do Projeto

```
node-express-pdf-email
├── src
│   ├── app.ts                     # Ponto de entrada da aplicação
│   ├── controllers
│   │   └── uploadController.ts     # Controlador para gerenciar uploads e envio de e-mails
│   ├── routes
│   │   └── uploadRoutes.ts         # Rotas para upload de arquivos
│   ├── services
│   │   └── emailService.ts         # Serviço para envio de e-mails
│   ├── config
│   │   └── smtp.ts                 # Configuração do servidor SMTP
│   ├── middleware
│   │   └── uploadMiddleware.ts      # Middleware para gerenciar uploads
│   └── types
│       └── index.d.ts              # Tipos personalizados utilizados no projeto
├── tests
│   └── upload.test.ts              # Testes para funcionalidades de upload e envio de e-mail
├── .env.example                     # Exemplo de configuração de variáveis de ambiente
├── package.json                     # Configuração do npm
├── tsconfig.json                   # Configuração do TypeScript
└── README.md                       # Documentação do projeto
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   cd node-express-pdf-email
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Crie um arquivo `.env` com as variáveis de ambiente necessárias, utilizando o arquivo `.env.example` como referência.

## Uso

Para iniciar a aplicação, execute o seguinte comando:

```
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções.