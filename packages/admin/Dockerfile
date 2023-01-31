# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY packages/admin/package*.json ./

# Install the dependencies in the container
RUN yarn install

# Copy the rest of the files to the container
COPY packages/admin .

# Compile the TypeScript code
RUN yarn build

# Specify the command to run when the container starts
CMD ["yarn", "start"]