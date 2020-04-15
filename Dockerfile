FROM node:12

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY . /usr/app/

RUN npm install

EXPOSE 3333
CMD ["npm", "run", "dev"]
