import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // -- Add the following code to create a new User record --
  // const user1 = await prisma.user.create({
  //   data: {
  //     name: "Alice",
  //     email: "alice@prisma.io",
  //   },
  // });
  // console.log(user1);

  // -- Remove previous query and add the following code to retrieve User records --
  // const users = await prisma.user.findMany();
  // console.log(users);

  //  -- Remove previous query and add the following code --
  // const user2 = await prisma.user.create({
  //   data: {
  //     name: "Bob",
  //     email: "bob@prisma.io",
  //     posts: {
  //       create: [
  //         {
  //           title: "Hello World",
  //           published: true,
  //         },
  //         {
  //           title: "My second post",
  //           content: "This is still a draft",
  //         },
  //       ],
  //     },
  //   },
  // });
  // console.log(user2);

  // -- Remove previous query and add the following code --
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.dir(usersWithPosts, { depth: null });
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
