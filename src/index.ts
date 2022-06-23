import { ApolloServer } from 'apollo-server-express';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { importSchema } from 'graphql-import';
import creatureResolvers from './resolver/creature';
import speciesResolvers from './resolver/species';
import habitatResolvers from './resolver/habitat';
import explorationResolvers from './resolver/exploration';
import researcherResolvers from './resolver/researcher';
import conservationStatusResolvers from './resolver/conservation-status';
import observationResolvers from './resolver/observation';
import expeditionResolvers from './resolver/expedition';
import equipmentResolvers from './resolver/equipment';
import oceanResolvers from './resolver/ocean';

const prisma = new PrismaClient();

const typeDefs = importSchema('./src/schema/schema.graphql');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...creatureResolvers,
    ...speciesResolvers,
    ...habitatResolvers,
    ...explorationResolvers,
    ...researcherResolvers,
    ...conservationStatusResolvers,
    ...observationResolvers,
    ...expeditionResolvers,
    ...equipmentResolvers,
    ...oceanResolvers,
  },
});

const server = new ApolloServer({ schema, context: { prisma } });

const app: any = express();

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/graphql`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
