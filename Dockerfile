FROM node:12

RUN npm install -g nodemon
WORKDIR /usr/src

COPY package*.json .

RUN npm install

COPY . ./

EXPOSE 3333
CMD ["npm", "run", "dev"]
