FROM node:12.18.1

ENV NODE_ENV=production

WORKDIR /src

COPY ["package.json", "package-lock.json*", "./"]

RUN yarn add --production

COPY . .

CMD [ "node", "server.js" ]