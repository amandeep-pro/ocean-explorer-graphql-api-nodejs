import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import creatureResolvers from '../../src/resolver/creature';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...creatureResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Creature Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new creature', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          createCreature(name: "${faker.name.firstName()}", species: "${faker.animal.type()}", oceanId: "${ocean.id}") {
            id
            name
            species
            ocean {
              id
              name
            }
          }
        }
      `,
    });

    // Check for errors
    expect(result.errors).toBeUndefined();

    // Check for valid data
    const creature = result.data?.createCreature;
    expect(creature).toHaveProperty('id');
    expect(creature).toHaveProperty('name');
    expect(creature).toHaveProperty('species');
    expect(creature).toHaveProperty('ocean');

    // Verify the associated ocean
    expect(creature.ocean).toHaveProperty('id', ocean.id);
    expect(creature.ocean).toHaveProperty('name', ocean.name);
  });

  it('should update an existing creature', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const creature = await prisma.creature.create({
      data: { name: faker.name.firstName(), species: faker.animal.type(), oceanId: ocean.id }
    });

    const newName = faker.name.firstName();
    const result = await server.executeOperation({
      query: `
        mutation {
          updateCreature(id: "${creature.id}", name: "${newName}", species: "${faker.animal.type()}") {
            id
            name
            species
          }
        }
      `,
    });

    // Check for errors
    expect(result.errors).toBeUndefined();

    // Check for valid data
    const updatedCreature = result.data?.updateCreature;
    expect(updatedCreature).toHaveProperty('id', creature.id);
    expect(updatedCreature).toHaveProperty('name', newName);
    expect(updatedCreature).toHaveProperty('species');
  });

  it('should delete a creature', async () => {
    const ocean = await prisma.ocean.create({
      data: { name: faker.address.city(), depth: faker.datatype.float(), location: faker.address.country() }
    });

    const creature = await prisma.creature.create({
      data: { name: faker.name.firstName(), species: faker.animal.type(), oceanId: ocean.id }
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteCreature(id: "${creature.id}")
        }
      `,
    });

    // Check for errors
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteCreature).toBe(true);

    // Verify deletion
    const deletedCreature = await prisma.creature.findUnique({ where: { id: creature.id } });
    expect(deletedCreature).toBeNull();
  });
});
