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

2 - Copy .env.example to .env:

```
cp .env.example .env
```

3 - Install dependencies:

```
npm install
```

4 - Run the app:

```
make run
```

5 - Run the migrations:

```
make migrate
```

6 - Go to:

```
http://localhost:3333
```

7 - Run tests:

```
make test
```

## License

This project is under the [MIT](LICENSE) license.
