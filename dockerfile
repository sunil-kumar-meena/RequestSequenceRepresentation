FROM node:14

# Create app directory
WORKDIR /home/openbackhaul/request_sequence_representation

# Bundle app source
COPY . .

# Install npm packages for client
RUN cd ./impl/client && npm install

# Create build for react application
RUN cd ./impl/client && npm run build

# Install npm packages for server 
RUN cd ./impl/server && npm install

# Command to start the application
CMD ["sh", "-c", "cd ./impl/server && npm run start"]