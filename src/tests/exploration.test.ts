import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import explorationResolvers from '../../src/resolver/exploration';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...explorationResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Exploration Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new exploration', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          createExploration(date: "${faker.date.past().toISOString()}", oceanId: "${ocean.id}", details: "${faker.lorem.sentence()}") {
            id
            date
            ocean {
              id
            }
            details
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createExploration).toHaveProperty('id');
    expect(result.data?.createExploration).toHaveProperty('date');
    expect(result.data?.createExploration).toHaveProperty('ocean');
    expect(result.data?.createExploration).toHaveProperty('details');
  });

  it('should update an existing exploration', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const exploration = await prisma.exploration.create({
      data: { date: new Date().toISOString(), oceanId: ocean.id, details: faker.lorem.sentence() }
    });

    const newDetails = faker.lorem.sentence();

    const result = await server.executeOperation({
      query: `
        mutation {
          updateExploration(id: "${exploration.id}", details: "${newDetails}") {
            id
            details
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateExploration).toHaveProperty('id');
    expect(result.data?.updateExploration.details).toBe(newDetails);
  });

  it('should delete an exploration', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const exploration = await prisma.exploration.create({
      data: { date: new Date().toISOString(), oceanId: ocean.id, details: faker.lorem.sentence() }
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteExploration(id: "${exploration.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteExploration).toBe(true);
  });

  it('should retrieve all explorations', async () => {
    const result = await server.executeOperation({
      query: `
        query {
          explorations {
            id
            date
            details
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(Array.isArray(result.data?.explorations)).toBe(true);
  });
});
