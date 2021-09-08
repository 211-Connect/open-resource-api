FROM node:14.17

WORKDIR /app

COPY . .

RUN npm install

RUN npm install --only=dev && npm run build

CMD [ "npm", "start" ]