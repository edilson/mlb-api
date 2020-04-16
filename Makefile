run:
	docker-compose up

.PHONY: test
test:
	docker-compose run app npm test

migrate:
	docker-compose run app npx knex migrate:latest
