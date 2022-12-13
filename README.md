# Ocean Explorer GraphQL API

This project is a GraphQL API built with Node.js, Prisma, and Apollo Server to manage ocean exploration data, including expeditions, researchers, creatures, habitats, and more.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- CRUD operations for expeditions, researchers, creatures, habitats, and other entities.
- Mock data generation for testing.
- Comprehensive resolver tests.
- Type-safe API using TypeScript.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- MySQL database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amandeep-pro/ocean-explorer-graphql-api.git
   cd ocean-explorer-graphql-api
   npm i
   npm run migration
   npm run dev
