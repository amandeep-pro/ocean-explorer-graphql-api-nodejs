import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import conservationStatusResolvers from '../../src/resolver/conservation-status';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...conservationStatusResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('ConservationStatus Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new conservation status', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createConservationStatus(status: "${faker.lorem.word()}", description: "${faker.lorem.sentence()}") {
            id
            status
            description
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createConservationStatus).toHaveProperty('id');
    expect(result.data?.createConservationStatus).toHaveProperty('status');
    expect(result.data?.createConservationStatus).toHaveProperty('description');
  });

  it('should update a conservation status', async () => {
    const createdStatus = await prisma.conservationStatus.create({
      data: {
        status: faker.lorem.word(),
        description: faker.lorem.sentence(),
      },
    });

    const newStatus = faker.lorem.word();
    const newDescription = faker.lorem.sentence();

    const result = await server.executeOperation({
      query: `
        mutation {
          updateConservationStatus(id: "${createdStatus.id}", status: "${newStatus}", description: "${newDescription}") {
            id
            status
            description
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateConservationStatus).toHaveProperty('id', createdStatus.id);
    expect(result.data?.updateConservationStatus).toHaveProperty('status', newStatus);
    expect(result.data?.updateConservationStatus).toHaveProperty('description', newDescription);
  });

  it('should delete a conservation status', async () => {
    const createdStatus = await prisma.conservationStatus.create({
      data: {
        status: faker.lorem.word(),
        description: faker.lorem.sentence(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteConservationStatus(id: "${createdStatus.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteConservationStatus).toBe(true);
  });

  it('should retrieve all conservation statuses', async () => {
    // Create a few conservation statuses to ensure that we have data to retrieve
    await prisma.conservationStatus.createMany({
      data: [
        { status: faker.lorem.word(), description: faker.lorem.sentence() },
        { status: faker.lorem.word(), description: faker.lorem.sentence() },
      ],
    });

    const result = await server.executeOperation({
      query: `
        query {
          conservationStatuses {
            id
            status
            description
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(Array.isArray(result.data?.conservationStatuses)).toBe(true);
    expect(result.data?.conservationStatuses.length).toBeGreaterThan(0);
  });
});
