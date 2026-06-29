# Inherit from an existing image (Node version)
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json files into the image
COPY package*.json ./

# Installs the dependencies
RUN npm install

# Copy the rest of the source files into the image
COPY . .

# Expose port that the app listens on
EXPOSE 3001

# Run application
CMD npm start