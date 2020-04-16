# mlb-api

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/SEdilson/mlb-api.svg?style=svg)](https://circleci.com/gh/SEdilson/mlb-api)

A RESTful API for MLB. :baseball:

## Stack

This project uses:

- [NodeJS](https://nodejs.org)
- [ExpressJS](https://expressjs.com)
- [Knex](http://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- Docker & Docker Compose

## :rocket: Running

1 - Download or clone this repo:

```
git clone https://github.com/SEdilson/mlb-api.git
cd mlb-api
```

2 - Install dependencies:

```
npm install
```

3 - Run the app:

```
make run
```

4 - Run the migrations:

```
make migrate
```

5 - Go to:

```
http://localhost:3333
```

6 - Run tests:

```
docker-compose run app npm test
```

## License

This project is under the [MIT](LICENSE).
