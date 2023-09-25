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

### .env files

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

### Prisma

It's needed to re-run the `prisma generate` command after every change that's made to your Prisma schema to update the generated Prisma Client code.

```bash
$ prisma generate
```

## 💻 Running the app locally

```bash
# start database
$ yarn run db:dev:up

# set up database (first time only)
$ yarn run prisma:dev:deploy

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 💻 Running Lambda locally

It's necessary to have the AWS CLI installed and configured with the credentials of the AWS account where the lambda is deployed.
Also it's necessary to have the Serverless framework installed globally.

```bash
# start database
$ yarn run db:dev:up

# set up database (first time only)
$ yarn run prisma:dev:deploy

# development
$ yarn run start:lambda
```

## 🪲 Debugger

Add corresponding breakpoints in the code.

Run the app with the debug NestJS script

```bash
$ yarn run start:debug
```

Then run the `Debug` configuration in VSCode.

## 🧪 Tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## 📦 Deployment to AWS with Serverless

Before deploying to AWS, it's necessary to have the AWS CLI installed and configured with the credentials of the AWS account where the lambda is deployed.

Remember that the lambda is deployed to the `dev` stage by default. To deploy to another stage, it's necessary to change the `stage` property in the `serverless.yml` file.

```bash
$ serverless deploy

# or verbose mode
$ serverless deploy --verbose

# or to a specific stage, by default is dev
$ serverless deploy --stage prod

```

## 📦 Remove from AWS with Serverless

To delete CloudFormation stack and all resources, run the following command

```bash
$ serverless remove
```
