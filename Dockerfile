FROM node:12

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package.json /usr/app/

RUN npm install

ADD . /usr/app/

EXPOSE 3333
CMD ["npm", "run", "dev"]
