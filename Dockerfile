# Specify base image
FROM node:18-alpine3.16

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Remove prepare scripts (Husky)
RUN npm pkg delete scripts.prepare

# Update NPM
RUN npm install npm@latest

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

# exposed ports
EXPOSE 3000

# Set up a default command
CMD ["npm", "run", "start:dev"]
