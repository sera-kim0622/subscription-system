FROM node:22.0.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci || npm install

COPY . .

RUN npm run build

RUN npm install -g pm2

EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]