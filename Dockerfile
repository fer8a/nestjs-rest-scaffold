# Specify base image
FROM node:18-alpine AS builder
LABEL stage=builder

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

# Run the build command which creates the production bundle
RUN npm run build && npm prune --production

# Use the node user from the image (instead of the root user)
USER node

# ----------------------------------------------------------------------------------------------------------------------

# Specify base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the final image
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# exposed ports
EXPOSE 8000

# Set up a default command
CMD ["npm", "run", "start:prod"]

# Use the node user from the image (instead of the root user)
USER node

# command to run 
# sudo docker build -t boilerplate:latest . && sudo docker image prune -f
# sudo docker run -p 3000:3000 --env-file .env boilerplate:latest