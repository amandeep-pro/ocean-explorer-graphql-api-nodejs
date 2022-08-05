import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import oceanResolvers from '../../src/resolver/ocean';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...oceanResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Ocean Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new ocean', async () => {
    const result = await server.executeOperation({
      query: `
        mutation {
          createOcean(name: "${faker.address.city()}", depth: ${faker.datatype.float()}, location: "${faker.address.country()}") {
            id
            name
            depth
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createOcean).toHaveProperty('id');
    expect(result.data?.createOcean).toHaveProperty('name');
    expect(result.data?.createOcean).toHaveProperty('depth');
    expect(result.data?.createOcean).toHaveProperty('location');
  });

  it('should update an ocean', async () => {
    const createdOcean = await prisma.ocean.create({
      data: {
        name: faker.address.city(),
        depth: faker.datatype.float(),
        location: faker.address.country(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          updateOcean(id: "${createdOcean.id}", name: "Updated Name", depth: ${faker.datatype.float()}, location: "Updated Location") {
            id
            name
            depth
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateOcean).toHaveProperty('id', createdOcean.id);
    expect(result.data?.updateOcean).toHaveProperty('name', 'Updated Name');
    expect(result.data?.updateOcean).toHaveProperty('depth');
    expect(result.data?.updateOcean).toHaveProperty('location', 'Updated Location');
  });

  it('should delete an ocean', async () => {
    const createdOcean = await prisma.ocean.create({
      data: {
        name: faker.address.city(),
        depth: faker.datatype.float(),
        location: faker.address.country(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteOcean(id: "${createdOcean.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteOcean).toBe(true);
  });

  it('should query an ocean', async () => {
    const createdOcean = await prisma.ocean.create({
      data: {
        name: faker.address.city(),
        depth: faker.datatype.float(),
        location: faker.address.country(),
      },
    });

    const result = await server.executeOperation({
      query: `
        query {
          oceans {
            id
            name
            depth
            location
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.oceans).toBeInstanceOf(Array);
    expect(result.data?.oceans).toContainEqual(expect.objectContaining({
      id: createdOcean.id,
      name: createdOcean.name,
      depth: createdOcean.depth,
      location: createdOcean.location,
    }));
  });
});
