FROM node:12

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package.json /usr/app/

RUN npm install

ADD . /usr/app/
RUN chmod +x /usr/app/wait-for-it.sh

EXPOSE 3333
CMD ["./wait-for-it.sh", "db:5432", "--timeout=0", "--", "npm", "run", "dev"]
