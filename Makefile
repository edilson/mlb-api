run:
	docker-compose up

.PHONY: test
test:
	docker-compose run app npm test
	rm -rf ./src/database/test.sqlite

migrate:
	docker-compose run app npx knex migrate:latest
