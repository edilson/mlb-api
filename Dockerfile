FROM node:12

WORKDIR /usr/src
RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3333
CMD ["npm", "run", "dev"]
