import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import speciesResolvers from '../../src/resolver/species';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...speciesResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Species Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new species', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createSpecies(name: "${faker.animal.type()}") {
            id
            name
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createSpecies).toHaveProperty('id');
    expect(result.data?.createSpecies).toHaveProperty('name');
  });

  it('should update an existing species', async () => {
    const species = await prisma.species.create({
      data: { name: faker.animal.type() },
    });

    const newName = faker.animal.type();
    const result = await server.executeOperation({
      query: `
        mutation {
          updateSpecies(id: "${species.id}", name: "${newName}") {
            id
            name
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateSpecies).toHaveProperty('id');
    expect(result.data?.updateSpecies.name).toBe(newName);
  });

  it('should delete a species', async () => {
    const species = await prisma.species.create({
      data: { name: faker.animal.type() },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteSpecies(id: "${species.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteSpecies).toBe(true);

    const deletedSpecies = await prisma.species.findUnique({
      where: { id: species.id },
    });

    expect(deletedSpecies).toBeNull();
  });

  it('should retrieve all species', async () => {
    await prisma.species.createMany({
      data: [
        { name: faker.animal.type() },
        { name: faker.animal.type() },
      ],
    });

    const result = await server.executeOperation({
      query: `
        query {
          species {
            id
            name
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.species).toBeInstanceOf(Array);
    expect(result.data?.species.length).toBeGreaterThan(0);
  });
});
