FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the local machine into the container
COPY . .

# Expose the port 
EXPOSE  5000


# Run the app in development mode
CMD ["npm", "run", "dev"]