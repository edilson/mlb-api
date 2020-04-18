const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create user', () => {
    const payload = {
      name: 'Maria Silva',
      email: 'mariasilva@hotmail.com',
      password: '123ro',
    };

    const invalidPayload = {
      name: 'Ju',
      email: 'ju@hotmail.com',
      password: '123ml',
    };

    it('Test create user should return 201', (done) => {
      chai
        .request(server)
        .post('/v1/register')
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          expect(response.body).have.property('name');
          expect(response.body).have.property('email');
          done();
        });
    });

    it('Test create user with invalid data should return 400', (done) => {
      chai
        .request(server)
        .post('/v1/register')
        .send(invalidPayload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
            '"name" length must be at least 5 characters long'
          );
          done();
        });
    });
  });
});
