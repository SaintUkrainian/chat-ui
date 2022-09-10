# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /chat-ui

# add `/chat-ui/node_modules/.bin` to $PATH
ENV PATH /chat-ui/node_modules/.bin:$PATH

# install chat-ui dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add chat-ui
COPY . ./

# start chat-ui
CMD ["npm", "start"]