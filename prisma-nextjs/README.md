# Comprehensive Guide to Using Prisma ORM with Next.js

See more information at [Prisma docs](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#challenges-of-using-prisma-orm-in-monorepos)

Prisma ORM and Next.js form a powerful combination for building modern, server-side rendered, and API-driven web applications. This guide consolidates various tips and strategies to help you maximize their potential. Whether you’re looking for best practices, monorepo setup guidance, or strategies for dynamic usage, we’ve got you covered.

## Best practices for using Prisma Client in development

### Avoid multiple Prisma Client instances

When developing a Next.js application, one common issue is accidentally creating multiple instances of the Prisma Client. This often occurs due to Next.js’s hot-reloading feature in development.

#### Why this happens

Next.js’s hot-reloading feature reloads modules frequently to reflect code changes instantly. However, this can lead to multiple instances of Prisma Client being created, which consumes resources and might cause unexpected behavior.

#### Recommended solution

To avoid this, create a single Prisma Client instance by using a global variable:

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Using this approach ensures that only one instance of Prisma Client exists, even during hot-reloading in development.

Now you can import the `prisma` instance and use it in your code:

```ts
import { prisma } from "./lib/prisma";

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```
