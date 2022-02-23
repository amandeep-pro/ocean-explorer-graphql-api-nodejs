import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const habitatResolvers: IResolvers = {
  Query: {
    habitats: async () => await prisma.habitat.findMany(),
  },
  Mutation: {
    createHabitat: async (_parent, args) => {
      return await prisma.habitat.create({
        data: args,
      });
    },
    updateHabitat: async (_parent, args) => {
      return await prisma.habitat.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteHabitat: async (_parent, args) => {
      await prisma.habitat.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default habitatResolvers;
