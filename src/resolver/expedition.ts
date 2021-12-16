import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expeditionResolvers: IResolvers = {
  Query: {
    expeditions: async () => await prisma.expedition.findMany(),
  },
  Mutation: {
    createExpedition: async (_parent, args) => {
      return await prisma.expedition.create({
        data: args,
      });
    },
    updateExpedition: async (_parent, args) => {
      return await prisma.expedition.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteExpedition: async (_parent, args) => {
      await prisma.expedition.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default expeditionResolvers;
