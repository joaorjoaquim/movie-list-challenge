# Movie List Challenge

API RESTful para o teste de leitura da lista de indicados e vencedores da categoria pior filme do Golden Raspberry Awards utilizando um banco em memória.

## Requisitos

- Node.js (versao LTS recomendada)
- npm ou yarn

## Instalacao

### Opcao 1: Docker (Recomendado)

```bash
docker-compose up --build
```

A aplicacao estara disponivel em `http://localhost:5000`

Para parar:

```bash
docker-compose down
```

### Opcao 2: Local

```bash
npm install
# ou
yarn install

npm run dev
# ou
yarn dev
```

A aplicacao estara disponivel em `http://localhost:5000`

## Executando os testes

```bash
npm test
# ou
yarn test
```

Os testes sao de integracao e validam o funcionamento completo da API.

## Estrutura do projeto

```
src/
  config/              # Configuracoes (banco de dados, container de dependencias)
  controllers/         # Handlers HTTP
  domain/              # Camada de dominio (entidades e interfaces)
    entities/          # Entidades do dominio
    interfaces/        # Contratos (repositories, services, HTTP)
  infrastructure/      # Implementacoes concretas
    database/          # Adaptadores de banco de dados
    http/              # Adaptadores HTTP (Express)
  middlewares/         # Middlewares (tratamento de erros)
  repositories/        # Camada de acesso a dados
  routes/              # Definicao de rotas
  services/            # Logica de negocio
  utils/               # Funcoes utilitarias
  app.ts               # Configuracao do Express
  server.ts            # Entry point
```

## API

### Documentacao (Swagger)

A documentacao interativa da API esta disponivel em:
`http://localhost:5000/api-docs`

A rota raiz (`/`) redireciona automaticamente para a documentacao.

### Health Check

- `GET /health`: Retorna status da aplicacao, uptime e timestamp.

### Endpoints Principais

#### GET /api/producers/intervals

Retorna os produtores com maior e menor intervalo entre dois premios consecutivos.

**Exemplo de resposta:**

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## Banco de dados

A aplicacao utiliza PostgreSQL em memoria atraves da biblioteca `pg-mem`. Os dados sao carregados automaticamente do arquivo `movielist.csv` na inicializacao.

**Importante**: O arquivo `movielist.csv` deve estar na raiz do projeto.

## Scripts disponiveis

- `npm run dev` / `yarn dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` / `yarn build` - Compila o TypeScript
- `npm start` / `yarn start` - Inicia o servidor em producao (requer build previo)
- `npm test` / `yarn test` - Executa os testes de integracao
- `npm run lint` / `yarn lint` - Executa o linter
- `npm run format` / `yarn format` - Formata o codigo com Prettier
