import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const conservationStatusResolvers: IResolvers = {
  Query: {
    conservationStatuses: async () => await prisma.conservationStatus.findMany(),
  },
  Mutation: {
    createConservationStatus: async (_parent, args) => {
      return await prisma.conservationStatus.create({
        data: args,
      });
    },
    updateConservationStatus: async (_parent, args) => {
      return await prisma.conservationStatus.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteConservationStatus: async (_parent, args) => {
      await prisma.conservationStatus.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default conservationStatusResolvers;
