import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const oceanResolvers: IResolvers = {
  Query: {
    oceans: async () => await prisma.ocean.findMany(),
  },
  Mutation: {
    createOcean: async (_parent, args) => {
      return await prisma.ocean.create({
        data: args,
      });
    },
    updateOcean: async (_parent, args) => {
      return await prisma.ocean.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteOcean: async (_parent, args) => {
      await prisma.ocean.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default oceanResolvers;
