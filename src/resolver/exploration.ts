import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const explorationResolvers: IResolvers = {
  Query: {
    explorations: async () => await prisma.exploration.findMany({
      include: { ocean: true },
    }),
  },
  Mutation: {
    createExploration: async (_parent, args) => {
      const { date, oceanId, details } = args;
      return await prisma.exploration.create({
        data: {
          date,
          details,
          ocean: { connect: { id: oceanId } },
        },
        include: { ocean: true },
      });
    },
    updateExploration: async (_parent, args) => {
      const { id, date, oceanId, details } = args;
      return await prisma.exploration.update({
        where: { id },
        data: {
          date,
          details,
          ocean: oceanId ? { connect: { id: oceanId } } : undefined,
        },
        include: { ocean: true },
      });
    },
    deleteExploration: async (_parent, args) => {
      await prisma.exploration.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default explorationResolvers;
