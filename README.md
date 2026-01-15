# Movie List Challenge

API RESTful para leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Requisitos

- Node.js (versao LTS recomendada)
- npm ou yarn

## Instalacao

### Opcao 1: Docker (Recomendado)

```bash
docker-compose up --build
```

Ou apenas com Docker:

```bash
docker build -t movie-list-challenge .
docker run -p 5000:5000 movie-list-challenge
```

### Opcao 2: Local

```bash
npm install
# ou
yarn install
```

## Executando a aplicacao

### Com Docker

```bash
docker-compose up
```

### Local

```bash
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

## Estrutura do projeto

```
src/
  config/         # Configuracoes (banco de dados)
  controllers/    # Handlers HTTP
  middlewares/    # Middlewares (tratamento de erros)
  repositories/   # Camada de acesso a dados
  routes/         # Definicao de rotas
  services/       # Logica de negocio
  utils/          # Funcoes utilitarias
  app.ts          # Configuracao do Express
  server.ts       # Entry point
```

## API

### GET /api/producers/intervals

Retorna os produtores com maior e menor intervalo entre dois premios consecutivos.

**Resposta:**

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

## Banco de dados

A aplicacao utiliza PostgreSQL em memoria atraves da biblioteca `pg-mem`. Os dados sao carregados automaticamente do arquivo `movielist.csv` na inicializacao da aplicacao.

## Scripts disponiveis

- `npm run dev` / `yarn dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` / `yarn build` - Compila o TypeScript
- `npm start` / `yarn start` - Inicia o servidor em producao
- `npm test` / `yarn test` - Executa os testes de integracao
- `npm run lint` / `yarn lint` - Executa o linter
- `npm run format` / `yarn format` - Formata o codigo com Prettier

## Docker

### Build da imagem

```bash
docker build -t movie-list-challenge .
```

### Executar container

```bash
docker run -p 5000:5000 movie-list-challenge
```

### Docker Compose

```bash
docker-compose up --build
```

Para parar:

```bash
docker-compose down
```
