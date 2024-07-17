# Base image for building the application
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies and pnpm in one step for better caching
RUN npm install pnpm -g && pnpm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
