import { IResolvers } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const equipmentResolvers: IResolvers = {
  Query: {
    equipments: async () => await prisma.equipment.findMany(),
  },
  Mutation: {
    createEquipment: async (_parent, args) => {
      return await prisma.equipment.create({
        data: args,
      });
    },
    updateEquipment: async (_parent, args) => {
      return await prisma.equipment.update({
        where: { id: args.id },
        data: args,
      });
    },
    deleteEquipment: async (_parent, args) => {
      await prisma.equipment.delete({ where: { id: args.id } });
      return true;
    },
  },
};

export default equipmentResolvers;
