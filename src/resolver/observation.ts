import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const observationResolvers: IResolvers = {
  Query: {
    observations: async () => {
      return await prisma.observation.findMany({
        include: {
          researcher: true,
          creature: true,
        },
      });
    },
  },
  Mutation: {
    createObservation: async (_parent, args) => {
      const { date, details, researcherId, creatureId } = args;
      return await prisma.observation.create({
        data: {
          date: new Date(date),
          details,
          researcher: researcherId ? { connect: { id: researcherId } } : undefined,
          creature: creatureId ? { connect: { id: creatureId } } : undefined,
        } as any, 
        include: {
          researcher: true,
          creature: true,
        },
      });
    },
    updateObservation: async (_parent, args) => {
      const { id, date, details, researcherId, creatureId } = args;
      return await prisma.observation.update({
        where: { id },
        data: {
          date: date ? new Date(date) : undefined,
          details,
          researcher: researcherId ? { connect: { id: researcherId } } : undefined,
          creature: creatureId ? { connect: { id: creatureId } } : undefined,
        } as any, 
        include: {
          researcher: true,
          creature: true,
        },
      });
    },
    deleteObservation: async (_parent, args) => {
      const { id } = args;
      await prisma.observation.delete({
        where: { id },
      });
      return true;
    },
  },
};

export default observationResolvers;
