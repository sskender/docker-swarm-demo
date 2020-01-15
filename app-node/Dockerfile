FROM node:latest

RUN mkdir /app-node
WORKDIR /app-node

COPY index.js .
COPY package.json .

RUN npm install

CMD [ "node", "index.js"]
EXPOSE 5000