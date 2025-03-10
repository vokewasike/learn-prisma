# Prisma Schema

See more information at [Prisma docs](https://www.prisma.io/docs/orm/prisma-schema)

## Schema location
The default name for the Prisma Schema is a single file `schema.prisma` in your `prisma` folder. When your schema is named like this, the Prisma CLI will detect it automatically.

> If you are using the [`prismaSchemaFolder` preview feature](https://www.prisma.io/docs/orm/prisma-schema/overview/location#multi-file-prisma-schema) any files in the prisma/schema directory are detected automatically.

### Prisma Schema location
The Prisma CLI looks for the Prisma Schema in the following locations, in the following order:

1. The location specified by the [`--schema` flag](https://www.prisma.io/docs/orm/reference/prisma-cli-reference), which is available when you `introspect`, `generate`, `migrate`, and `studio`:

``` shell
prisma generate --schema=./alternative/schema.prisma
```

2. The location specified in the `package.json` file (version 2.7.0 and later):

``` json
"prisma": {
  "schema": "db/schema.prisma"
}
```

3. Default locations:

- `./prisma/schema.prisma`
- `./schema.prisma`

The Prisma CLI outputs the path of the schema that will be used. The following example shows the terminal output for `prisma db pull`:

``` shell
Environment variables loaded from .env
Prisma Schema loaded from prisma/schema.prisma

Introspecting based on datasource defined in prisma/schema.prisma …

✔ Introspected 4 models and wrote them into prisma/schema.prisma in 239ms

Run prisma generate to generate Prisma Client.
```


