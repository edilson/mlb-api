FROM node:12

WORKDIR /usr/src
RUN npm install -g nodemon && npm install -g cross-env && npm install -g mocha

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3333
CMD ["npm", "run", "dev"]
