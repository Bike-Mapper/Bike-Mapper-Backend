FROM node:18.16

WORKDIR /app

COPY package*.json ./
COPY yarn.lock /app
RUN yarn install 

COPY . /app  
