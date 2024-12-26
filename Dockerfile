FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY key.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server/server.js"]