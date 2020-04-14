FROM node:12

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333
CMD ["npm", "run", "dev"]
