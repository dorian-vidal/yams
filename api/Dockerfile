FROM node:lts-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm ci
RUN npm i -D nodemon ts-node
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8080
CMD [ "npm", "run", "dev-docker" ]