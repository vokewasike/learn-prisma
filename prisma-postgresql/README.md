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

![Prisma Client Install and Generate](./assets/prisma-client-install-and-generate-ece3e0733edc615e416d6d654c05e980.png)

Whenever you update your prisma schema, you will have to update your database schema using either `npx prisma db push` or `npx prisma migrate dev`. These commands serve different purposes in managing your database schema with Prisma. Here’s a breakdown of when and why to use each:

##### `npx prisma migrate dev`

- **Purpose:** This command generates and applies a new migration based on your Prisma schema changes. It creates migration files that keep a history of changes.
- **Use Case:** Use this when you want to maintain a record of database changes, which is essential for production environments or when working in teams. It allows for version control of your database schema.
- **Benefits:** This command also includes checks for applying migrations in a controlled manner, ensuring data integrity.

##### `npx prisma db push`

- **Purpose:** This command is used to push your current Prisma schema to the database directly. It applies any changes you've made to your schema without creating migration files.
- **Use Case:** It’s particularly useful during the development phase when you want to quickly sync your database schema with your Prisma schema without worrying about migration history.
- **Caution:** It can overwrite data if your schema changes affect existing tables or columns, so it’s best for early-stage development or prototyping.

## 4. Querying the database

### 4.1. Write your first query with Prisma Client

Now that you have generated [Prisma Client](https://www.prisma.io/docs/orm/prisma-client), you can start writing queries to read and write data in your database. For the purpose of this guide, you'll use a plain Node.js script to explore some basic features of Prisma Client.

Create a new file named `index.ts` and add the following code to it:

`index.ts`
``` ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Here's a quick overview of the different parts of the code snippet:

1. Import the `PrismaClient` constructor from the `@prisma/client` node module
2. Instantiate `PrismaClient`
3. Define an `async` function named `main` to send queries to the database
4. Call the `main` function
5. Close the database connections when the script terminates

Inside the `main` function, add the following query to read all `User` records from the database and print the result:

`index.ts`
``` ts
async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

Now run the code with this command:

``` shell
npx tsx index.ts
```

This should print an empty array because there are no User records in the database yet:

``` output
[]
```

### 4.2. Write data into the database

The `findMany` query you used in the previous section only reads data from the database (although it was still empty). In this section, you'll learn how to write a query to write new records into the `Post` and `User` tables.

Adjust the `main` function to send a `create` query to the database:

`index.ts`

``` ts
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```

This code creates a new `User` record together with new `Post` and `Profile` records using a [nested write](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes) query. The `User` record is connected to the two other ones via the `Post.author` ↔ `User.posts` and `Profile.user` ↔ `User.profile` [relation fields](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations#relation-fields) respectively.

Notice that you're passing the `include` option to `findMany` which tells Prisma Client to include the `posts` and `profile` relations on the returned `User` objects.

Run the code with this command:

``` shell
npx tsx index.ts
```

The output should look similar to this:

``` shell
[
  {
    email: 'alice@prisma.io',
    id: 1,
    name: 'Alice',
    posts: [
      {
        content: null,
        createdAt: 2020-03-21T16:45:01.246Z,
        updatedAt: 2020-03-21T16:45:01.246Z,
        id: 1,
        published: false,
        title: 'Hello World',
        authorId: 1,
      }
    ],
    profile: {
      bio: 'I like turtles',
      id: 1,
      userId: 1,
    }
  }
]
```

Also note that `allUsers` is *statically typed* thanks to [Prisma Client's generated types](https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types). You can observe the type by hovering over the allUsers variable in your editor. It should be typed as follows:

```
const allUsers: (User & {
  posts: Post[]
})[]

export type Post = {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number | null
}
```

The query added new records to the `User` and the `Post` tables:

**User**

| id  | email             | name   |
| --- | ----------------- | ------ |
| 1   | "alice@prisma.io" | "Alice" |

**Post**

| id  | createdAt                  | updatedAt                  | title         | content | published | authorId |
| --- | -------------------------- | -------------------------- | ------------- | ------- | --------- | -------- |
| 1   | 2020-03-21T16:45:01.246Z   | 2020-03-21T16:45:01.246Z   | "Hello World" | null    | false     | 1        |

**Profile**

| id  | bio             | userId |
| --- | --------------- | ------ |
| 1   | "I like turtles" | 1      |


> Note: The numbers in the `authorId` column on `Post` and `userId` column on `Profile` both reference the `id` column of the `User` table, meaning the `id` value `1` column therefore refers to the first (and only) `User` record in the database.

Before moving on to the next section, you'll "publish" the `Post` record you just created using an `update` query. Adjust the `main` function as follows:

`index.ts`
``` ts
async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  console.log(post)
}
```

Now run the code using the same command as before:

``` shell
npx tsx index.ts
```

You will see the following output:

``` shell
{
  id: 1,
  title: 'Hello World',
  content: null,
  published: true,
  authorId: 1
}
```

The `Post` record with an id of 1 now got updated in the database:

**Post**

| id  | title         | content | published | authorId |
| --- | ------------- | ------- | --------- | -------- |
| 1   | "Hello World" | null    | true      | 1        |


Fantastic, you just wrote new data into your database for the first time using Prisma Client 🚀

## 5. Next Steps

### 5.1. Build an app with Prisma ORM
The Prisma blog features comprehensive tutorials about Prisma ORM, check out our latest ones:

- [Build a fullstack app with Next.js](https://www.youtube.com/watch?v=QXxy8Uv1LnQ&ab_channel=ByteGrad)

### 5.2. Explore the data in Prisma Studio

Prisma Studio is a visual editor for the data in your database. Run `npx prisma studio` in your terminal.

If you are using [Prisma Postgres](https://www.prisma.io/postgres), you can also directly use Prisma Studio inside the [Console](https://console.prisma.io/?) by selecting the **Studio** tab in your project.

### 5.3 Get query insights and analytics with Prisma Optimize

[Prisma Optimize](https://www.prisma.io/docs/optimize) helps you generate insights and provides recommendations that can help you make your database queries faster. [Try it out now!](https://www.prisma.io/docs/optimize/getting-started)

Optimize aims to help developers of all skill levels write efficient database queries, reducing database load and making applications more responsive.