import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import observationResolvers from '../../src/resolver/observation';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema/schema.graphql'),
  resolvers: { ...observationResolvers },
});

const server = new ApolloServer({ schema, context: { prisma } });

describe('Observation Resolver', () => {
  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    await prisma.$disconnect();
  });

  it('should create a new observation', async () => {
    const ocean = await prisma.ocean.create({
      data: {
        name: faker.lorem.word(),
        depth: faker.datatype.number({ min: 1000, max: 10000 }),
        location: faker.address.city(),
      },
    });

    const creature = await prisma.creature.create({
      data: {
        name: faker.lorem.word(),
        species: faker.lorem.word(),
        oceanId: ocean.id,
      },
    });

    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          createObservation(date: "${faker.date.past().toISOString()}", details: "${faker.lorem.sentence()}", researcherId: "${researcher.id}", creatureId: "${creature.id}") {
            id
            date
            details
            researcher {
              id
              name
            }
            creature {
              id
              name
            }
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createObservation).toHaveProperty('id');
    expect(result.data?.createObservation).toHaveProperty('date');
    expect(result.data?.createObservation).toHaveProperty('details');
    expect(result.data?.createObservation.researcher).toHaveProperty('id', researcher.id);
    expect(result.data?.createObservation.creature).toHaveProperty('id', creature.id);
  });

  it('should update an observation', async () => {
    const ocean = await prisma.ocean.create({
      data: {
        name: faker.lorem.word(),
        depth: faker.datatype.number({ min: 1000, max: 10000 }),
        location: faker.address.city(),
      },
    });

    const creature = await prisma.creature.create({
      data: {
        name: faker.lorem.word(),
        species: faker.lorem.word(),
        oceanId: ocean.id,
      },
    });

    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    const createdObservation = await prisma.observation.create({
      data: {
        date: faker.date.past().toISOString(),
        details: faker.lorem.sentence(),
        researcherId: researcher.id,
        creatureId: creature.id,
      },
    });

    const newDate = faker.date.future().toISOString();
    const newDetails = 'Updated details';

    const result = await server.executeOperation({
      query: `
        mutation {
          updateObservation(id: "${createdObservation.id}", date: "${newDate}", details: "${newDetails}", researcherId: "${researcher.id}", creatureId: "${creature.id}") {
            id
            date
            details
            researcher {
              id
              name
            }
            creature {
              id
              name
            }
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateObservation).toHaveProperty('id', createdObservation.id);
    expect(result.data?.updateObservation).toHaveProperty('details', newDetails);
  });

  it('should delete an observation', async () => {
    const ocean = await prisma.ocean.create({
      data: {
        name: faker.lorem.word(),
        depth: faker.datatype.number({ min: 1000, max: 10000 }),
        location: faker.address.city(),
      },
    });

    const creature = await prisma.creature.create({
      data: {
        name: faker.lorem.word(),
        species: faker.lorem.word(),
        oceanId: ocean.id,
      },
    });

    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    const createdObservation = await prisma.observation.create({
      data: {
        date: faker.date.past().toISOString(),
        details: faker.lorem.sentence(),
        researcherId: researcher.id,
        creatureId: creature.id,
      },
    });

    const result = await server.executeOperation({
      query: `
        mutation {
          deleteObservation(id: "${createdObservation.id}")
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteObservation).toBe(true);
  });

  it('should retrieve all observations', async () => {
    const ocean = await prisma.ocean.create({
      data: {
        name: faker.lorem.word(),
        depth: faker.datatype.number({ min: 1000, max: 10000 }),
        location: faker.address.city(),
      },
    });

    const creature = await prisma.creature.create({
      data: {
        name: faker.lorem.word(),
        species: faker.lorem.word(),
        oceanId: ocean.id,
      },
    });

    const researcher = await prisma.researcher.create({
      data: {
        name: faker.name.fullName(),
        expertise: faker.lorem.word(),
      },
    });

    await prisma.observation.createMany({
      data: [
        {
          date: faker.date.past().toISOString(),
          details: faker.lorem.sentence(),
          researcherId: researcher.id,
          creatureId: creature.id,
        },
        {
          date: faker.date.past().toISOString(),
          details: faker.lorem.sentence(),
          researcherId: researcher.id,
          creatureId: creature.id,
        },
      ],
    });

    const result = await server.executeOperation({
      query: `
        query {
          observations {
            id
            date
            details
            researcher {
              id
              name
            }
            creature {
              id
              name
            }
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(Array.isArray(result.data?.observations)).toBe(true);
    expect(result.data?.observations.length).toBeGreaterThan(0);
  });
});
