# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package*.json ./

# Install production dependencies
RUN yarn install --production

# Copy the rest of the application files
COPY . .

# Build the application
RUN yarn build

# Expose the port that the application will run on
EXPOSE 5000

# Start the application
CMD ["yarn", "start"]