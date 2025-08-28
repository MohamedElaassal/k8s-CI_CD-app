#Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies using npm
RUN npm install

# Copy all the project files from the current directory(build context) to the working directory
#in the container
COPY . .

# Expose port 3000 to allow external access to the application
EXPOSE 3000

# node app.js command'll run when the container starts
CMD ["node", "app.js"]