FROM node:20

WORKDIR /usr/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 5500

# Start the application
CMD ["nodejs", "index.js"]
