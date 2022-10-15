import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import expeditionResolvers from '../../src/resolver/expedition';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...expeditionResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Expedition Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new expedition', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createExpedition(name: "${faker.lorem.word()}", date: "${faker.date.past().toISOString()}", details: "${faker.lorem.sentence()}") {
            id
            name
            date
            details
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createExpedition).toHaveProperty('id');
    expect(result.data?.createExpedition).toHaveProperty('name');
    expect(result.data?.createExpedition).toHaveProperty('date');
    expect(result.data?.createExpedition).toHaveProperty('details');
  });

  it('should update an expedition', async () => {
    const createdExpedition = await prisma.expedition.create({
      data: {
        name: faker.lorem.word(),
        date: faker.date.past(),
        details: faker.lorem.sentence(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          updateExpedition(id: "${createdExpedition.id}", name: "Updated Name", date: "${faker.date.future().toISOString()}", details: "Updated details") {
            id
            name
            date
            details
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateExpedition).toHaveProperty('id', createdExpedition.id);
    expect(result.data?.updateExpedition).toHaveProperty('name', 'Updated Name');
    expect(result.data?.updateExpedition).toHaveProperty('date');
    expect(result.data?.updateExpedition).toHaveProperty('details', 'Updated details');
  });

  it('should delete an expedition', async () => {
    const createdExpedition = await prisma.expedition.create({
      data: {
        name: faker.lorem.word(),
        date: faker.date.past(),
        details: faker.lorem.sentence(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteExpedition(id: "${createdExpedition.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteExpedition).toBe(true);
  });
});
