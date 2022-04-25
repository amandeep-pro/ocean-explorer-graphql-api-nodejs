import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const speciesResolvers: IResolvers = {
  Query: {
    species: async () => await prisma.species.findMany(),
  },
  Mutation: {
    createSpecies: async (_parent, args) => {
      return await prisma.species.create({
        data: args,
      });
    },
    updateSpecies: async (_parent, args) => {
      return await prisma.species.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteSpecies: async (_parent, args) => {
      await prisma.species.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default speciesResolvers;
