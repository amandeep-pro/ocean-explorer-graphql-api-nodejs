import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import researcherResolvers from '../../src/resolver/researcher';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...researcherResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Researcher Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new researcher', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createResearcher(name: "${faker.name.fullName()}", expertise: "${faker.lorem.word()}") {
            id
            name
            expertise
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createResearcher).toHaveProperty('id');
    expect(result.data?.createResearcher).toHaveProperty('name');
    expect(result.data?.createResearcher).toHaveProperty('expertise');
  });

  it('should update an existing researcher', async () => {
    // Create a researcher first
    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    const newName = faker.name.fullName();
    const newExpertise = faker.lorem.word();

    const result = await server.executeOperation({
      query: `
        mutation {
          updateResearcher(id: "${researcher.id}", name: "${newName}", expertise: "${newExpertise}") {
            id
            name
            expertise
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateResearcher).toHaveProperty('id');
    expect(result.data?.updateResearcher.name).toBe(newName);
    expect(result.data?.updateResearcher.expertise).toBe(newExpertise);
  });

  it('should delete a researcher', async () => {
    // Create a researcher first
    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteResearcher(id: "${researcher.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteResearcher).toBe(true);
  });

  it('should retrieve all researchers', async () => {
    const result = await server.executeOperation({
      query: `
        query {
          researchers {
            id
            name
            expertise
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(Array.isArray(result.data?.researchers)).toBe(true);
  });
});
