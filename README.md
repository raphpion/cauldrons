# Cauldrons

Cauldrons is a social platform that connects users by grouping them into dynamic communities. With Cauldrons, gamers and content creators can join forces to organize and participate in unique online events. By fostering a vibrant and collaborative community, Cauldrons offers an exciting new way to play and create content together on the web.

## Getting started

Before you begin, make sure you are running Node.js version 14 and you have Yarn installed globally. You will also need Docker installed and enabled on your machine. Then, install the dependencies for all the packages by running `yarn install`.

Then, you will need to set the environment variables by duplicating the `*.env.example` files to `*.local.env`, `*.dev.env` and `*.prod.env` and filling out their values in the repository's root directory. Also set the environment variables in each of the packages (where applicable) by renaming the `env.example` files to `.env`.

To develop locally, first run `yarn compose:local` to start the images. Then, start the packages you want to work on by running `yarn dev:PACKAGE_NAME`. Here is a list of available packages and their dependencies :

- `backend` (standalone)

- `admin` (requires `backend`)

- `frontend` (requires `backend` and `content`)

## Infrastructure

Cauldrons' infrastructure is composed of multiple projects:

- [admin](./packages/admin/README.md): a Next.js user interface to manage the application's data and content.

- [backend](./packages/backend/README.md): an Express REST api to connect the different projects together and manage their data with the database.

- [frontend](./packages/frontend/README.md): a Next.js application that contains the website and the client app.

## Deploy

_This section is not completed yet._
