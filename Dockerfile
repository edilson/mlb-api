FROM node:12

WORKDIR /usr/src
RUN npm install nodemon \
    cross-env \
    mocha \
    chai \
    chai-http -g

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3333
CMD ["npm", "run", "dev"]
