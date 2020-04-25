run:
	docker-compose up --build

.PHONY: test
test:
	docker-compose run app npm test

migrate:
	docker-compose run app npx knex migrate:latest
