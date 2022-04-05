import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const researcherResolvers: IResolvers = {
  Query: {
    researchers: async () => await prisma.researcher.findMany(),
  },
  Mutation: {
    createResearcher: async (_parent, args) => {
      return await prisma.researcher.create({
        data: args,
      });
    },
    updateResearcher: async (_parent, args) => {
      return await prisma.researcher.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteResearcher: async (_parent, args) => {
      await prisma.researcher.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default researcherResolvers;
