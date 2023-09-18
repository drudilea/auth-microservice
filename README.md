# Auth microservice

Generic authentication microservice for several projects

## 📋 Requirements

- Node v18.17
- Yarn v1.22.19
- PostgreSQL v15.4
- NestJS v10.1.11

## 📦 Installation

```bash
$ yarn install
```

## ⚙️ Configuration

Create a `.env` file in the root directory of the project with the following syntax:

```
DATABASE_URL="postgresql://<user>:<pass>@localhost:5434/auth-nest?schema=public"
JWT_SECRET="..."
```

And a `.env.test` file in the root directory of the project with the same syntax but changing the port of the database:

```
DATABASE_URL="postgresql://<user>:<pass>@localhost:5435/auth-nest?schema=public"
JWT_SECRET="..."
```

## 💻 Running the app

```bash
# start database
$ yarn run db:dev:up

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 🧪 Tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
