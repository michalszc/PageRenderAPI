# PageRenderAPI

[![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)](https://www.apollographql.com/)[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)[![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)[![.ENV](https://img.shields.io/badge/.ENV-22272e?style=for-the-badge&logo=.env)](https://github.com/motdotla/dotenv#readme)[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

This Node.js project provides a GraphQL API that allows users to convert web pages to PDF, PNG, JPEG or WEBP format by passing the URL of the target web page. 

## Installation

#### Clone the repo and install dependencies:

```bash
git clone https://github.com/michalszc/PageRenderAPI.git
cd PageRenderAPI
npm install
```

#### Set environment variables (.env):

```bash
PGUSER=user
PGPASSWORD=password
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=render
AWS_BUCKET=bucket
AWS_REGION=eu-central-1
AWS_ACCESS_KEY=access
AWS_SECRET_KEY=secret
AWS_S3_ENDPOINT=http://127.0.0.1:4566 # if using Localstack
```

## Running in Development

```bash
# Build and run project
npm run start

# Build the project, run it and watch for changes
npm run watch
```

## Lint

```bash
# lint code with ESLint
npm run lint

# try to fix ESLint errors
npm run lint:fix
```

## Test

```bash
# run all tests with jest
npm run test

# run all tests and report coverage information
npm run test:coverage
```

## Validate

```bash
# run lint and tests
npm run validate
```

## Docker

```bash
# run container in development (run only services - postgres and s3 on localstack)
npm run docker:dev

# run container (services + this application)
npm run docker:start
```

## License
[![Licence](https://img.shields.io/github/license/michalszc/PageRenderAPI?style=for-the-badge)](./LICENSE)

