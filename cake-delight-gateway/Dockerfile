FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004
EXPOSE 9876

CMD ["node", "server.js"]