FROM node:12

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ADD package.json /usr/app/package.json

RUN npm install

ADD . /usr/app/

EXPOSE 3333
CMD ["npm", "run", "dev"]
