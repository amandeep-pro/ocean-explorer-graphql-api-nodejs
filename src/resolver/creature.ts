import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const creatureResolvers: IResolvers = {
  Query: {
    creatures: async () => await prisma.creature.findMany(),
  },
  Mutation: {
    createCreature: async (_parent, args) => {
      const { name, species, oceanId } = args;
      return await prisma.creature.create({
        data: {
          name,
          species,
          ocean: { connect: { id: oceanId } },
        },
        include: {
          ocean: true,
        },
      });
    },
    updateCreature: async (_parent, args) => {
      const { id, name, species, oceanId } = args;
      return await prisma.creature.update({
        where: { id },
        data: {
          name,
          species,
          ocean: oceanId ? { connect: { id: oceanId } } : undefined,
        },
        include: {
          ocean: true,
        },
      });
    },
    deleteCreature: async (_parent, args) => {
      await prisma.creature.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default creatureResolvers;
