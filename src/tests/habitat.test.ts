import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import habitatResolvers from '../../src/resolver/habitat';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...habitatResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Habitat Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new habitat', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createHabitat(name: "${faker.address.city()}", location: "${faker.address.country()}") {
            id
            name
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createHabitat).toHaveProperty('id');
    expect(result.data?.createHabitat).toHaveProperty('name');
    expect(result.data?.createHabitat).toHaveProperty('location');
  });

  it('should update an existing habitat', async () => {
    const habitat = await prisma.habitat.create({
      data: { name: faker.address.city(), location: faker.address.country() },
    });

    const newName = faker.address.city();
    const newLocation = faker.address.country();
    const result = await server.executeOperation({
      query: `
        mutation {
          updateHabitat(id: "${habitat.id}", name: "${newName}", location: "${newLocation}") {
            id
            name
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateHabitat).toHaveProperty('id');
    expect(result.data?.updateHabitat.name).toBe(newName);
    expect(result.data?.updateHabitat.location).toBe(newLocation);
  });

  it('should delete a habitat', async () => {
    const habitat = await prisma.habitat.create({
      data: { name: faker.address.city(), location: faker.address.country() },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteHabitat(id: "${habitat.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteHabitat).toBe(true);

    const deletedHabitat = await prisma.habitat.findUnique({
      where: { id: habitat.id },
    });

    expect(deletedHabitat).toBeNull();
  });

  it('should retrieve all habitats', async () => {
    await prisma.habitat.createMany({
      data: [
        { name: faker.address.city(), location: faker.address.country() },
        { name: faker.address.city(), location: faker.address.country() },
      ],
    });

    const result = await server.executeOperation({
      query: `
        query {
          habitats {
            id
            name
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.habitats).toBeInstanceOf(Array);
    expect(result.data?.habitats.length).toBeGreaterThan(0);
  });
});
