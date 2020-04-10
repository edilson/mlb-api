FROM node:12

RUN mkdir -p /usr/src

RUN npm install -g nodemon
WORKDIR /usr/src/

COPY package*.json /usr/src/

RUN npm install

COPY ./ /usr/src/

EXPOSE 3333
CMD ["npm", "run", "dev"]
