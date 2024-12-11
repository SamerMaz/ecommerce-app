import { PrismaClient } from '@prisma/client';
// import { SignUpSchema } from '../schema/users';

const prismaClient = new PrismaClient({
  log: ['query'], // Logs all queries to the console
});

// .$extends({
//   query: {
//     user: {
//       create({ args, query }) {
//         args.data = SignUpSchema.parse(args.data);
//         return query(args);
//       },
//     },
//   },
// });

export default prismaClient;
