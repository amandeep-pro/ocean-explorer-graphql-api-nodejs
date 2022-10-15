import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import equipmentResolvers from '../../src/resolver/equipment';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...equipmentResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Equipment Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new equipment', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createEquipment(name: "${faker.lorem.word()}", type: "${faker.lorem.word()}", usage: "${faker.lorem.sentence()}") {
            id
            name
            type
            usage
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createEquipment).toHaveProperty('id');
    expect(result.data?.createEquipment).toHaveProperty('name');
    expect(result.data?.createEquipment).toHaveProperty('type');
    expect(result.data?.createEquipment).toHaveProperty('usage');
  });

  it('should update an equipment', async () => {
    const createdEquipment = await prisma.equipment.create({
      data: {
        name: faker.lorem.word(),
        type: faker.lorem.word(),
        usage: faker.lorem.sentence(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          updateEquipment(id: "${createdEquipment.id}", name: "Updated Name", type: "Updated Type", usage: "Updated usage") {
            id
            name
            type
            usage
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateEquipment).toHaveProperty('id', createdEquipment.id);
    expect(result.data?.updateEquipment).toHaveProperty('name', 'Updated Name');
    expect(result.data?.updateEquipment).toHaveProperty('type', 'Updated Type');
    expect(result.data?.updateEquipment).toHaveProperty('usage', 'Updated usage');
  });

  it('should delete an equipment', async () => {
    const createdEquipment = await prisma.equipment.create({
      data: {
        name: faker.lorem.word(),
        type: faker.lorem.word(),
        usage: faker.lorem.sentence(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteEquipment(id: "${createdEquipment.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteEquipment).toBe(true);
  });
});
