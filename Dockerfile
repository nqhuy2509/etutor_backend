FROM node:20 AS build

WORKDIR /usr/src/app

ENV NODE_OPTIONS=--max_old_space_size=4096

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# prod stage
FROM node:20

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/dist ./dist

COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD npm run start:prod