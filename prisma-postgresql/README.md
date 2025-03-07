# Prisma Postgresql
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

Learn how to create a new Node.js or TypeScript project from scratch by connecting Prisma ORM to your database and generating a Prisma Client for database access. The following tutorial introduces you to the [Prisma CLI](https://www.prisma.io/docs/orm/tools/prisma-cli), [Prisma Client](https://www.prisma.io/docs/orm/prisma-client), and [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate).

## Prerequisites

In order to successfully complete this guide, you need:

- [Node.js](https://nodejs.org/en/) installed on your machine
- a [PostgreSQL](https://www.postgresql.org/) database server running

> See [system requirements](https://www.prisma.io/docs/orm/reference/system-requirements) for exact version requirements.

## 1. Create TypeScript project and set up Prisma ORM

As a first step, create a project directory and navigate into it:

```bash
mkdir prisma-postgresql
cd prisma-postgresql
```

Next, initialize a TypeScript project using npm:

```bash
npm init -y
npm install typescript tsx @types/node --save-dev
```

This creates a `package.json` with an initial setup for your TypeScript app.

> ⚠️ **INFO**  
> See [installation instructions](https://www.prisma.io/docs/orm/tools/prisma-cli#installation) to learn how to install Prisma using a different package manager.

Now, initialize TypeScript:

```bash
npx tsc --init
```

Then, install the Prisma CLI as a development dependency in the project:

```bash
npm install prisma --save-dev
```

You can now invoke the Prisma CLI by prefixing it with npx:

```bash
npx prisma
```

Next, set up your Prisma ORM project by creating your Prisma Schema file with the following command:

```bash
npx prisma init
```

This command does two things:

- creates a new directory called `prisma` that contains a file called `schema.prisma`, which contains the Prisma schema with your database connection variable and schema models
- creates the `.env` file in the root directory of the project, which is used for defining environment variables (such as your database connection)

## 2. Connect your database
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql

To connect your database, you need to set the `url` field of the `datasource` block in your Prisma schema to your database [connection URL](https://www.prisma.io/docs/orm/reference/connection-urls):

`prisma/schema.prisma`
``` prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
``` 

In this case, the `url` is [set via an environment variable](https://www.prisma.io/docs/orm/more/development-environment/environment-variables) which is defined in `.env`:

`.env`
``` 
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

> ⚠️ **INFO**  
> We recommend adding `.env` to your `.gitignore` file to prevent committing your environment variables.

You now need to adjust the connection URL to point to your own database.

The format of the connection URL for your database depends on the database you use. For PostgreSQL, it looks as follows (the parts spelled all-uppercased are placeholders for your specific connection details):

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

Here's a short explanation of each component:

- `USER`: The name of your database user
- `PASSWORD`: The password for your database user
- `HOST`: The name of your host name (for the local environment, it is `localhost`)
- `PORT`: The port where your database server is running (typically `5432` for PostgreSQL)
- `DATABASE`: The name of the [database](https://www.postgresql.org/docs/12/manage-ag-overview.html)
- `SCHEMA`: The name of the [schema](https://www.postgresql.org/docs/12/ddl-schemas.html) inside the database

If you're unsure what to provide for the `schema` parameter for a PostgreSQL connection URL, you can probably omit it. In that case, the default schema name `public` will be used.

As an example, for a PostgreSQL database hosted on Heroku, the [connection URL](https://www.prisma.io/docs/orm/reference/connection-urls) might look similar to this:

`.env`
```
DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

When running PostgreSQL locally on macOS, your user and password as well as the database name typically correspond to the current user of your OS, e.g. assuming the user is called `janedoe`:

`.env`
```
DATABASE_URL="postgresql://janedoe:janedoepassword@localhost:5432/janedoe
```

## 3. Using Prisma Migrate

### 3.1. Creating the database schema

In this guide, you'll use [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) to create the tables in your database. Add the following data model to your [Prisma schema](https://www.prisma.io/docs/orm/prisma-schema) in `prisma/schema.prisma`:

``` prisma
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

To map your data model to the database schema, you need to use the `prisma migrate` CLI commands:

``` bash
npx prisma migrate dev --name init
```

This command does two things:

1. It creates a new SQL migration file for this migration
2. It runs the SQL migration file against the database

> ⚠️ **NOTE** <br>
> `generate` is called under the hood by default, after running `prisma migrate dev`. If the `prisma-client-js` generator is defined in your schema, this will check if `@prisma/client` is installed and install it if it's missing.

Great, you now created three tables in your database with Prisma Migrate 🚀

## 4. Install Prisma Client

### 4.1. Install and generate Prisma Client

To get started with Prisma Client, you need to install the `@prisma/client` package:

``` bash
npm install @prisma/client
```

The install command invokes `prisma generate` for you which reads your Prisma schema and generates a version of Prisma Client that is *tailored* to your models.
