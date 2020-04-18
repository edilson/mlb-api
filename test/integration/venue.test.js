const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');
const createTeamTestHelper = require('../createTeamTestHelper');
const createVenueTestHelper = require('../createVenueTestHelper');

chai.use(chaiHttp);

describe('Venues', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    const firstTeam = await createTeamTestHelper();
    await createTeamTestHelper();

    await createVenueTestHelper(firstTeam.id);
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Venue', () => {
    it('Test create venue should return 201', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .post('/v1/venues')
            .send({
              name: 'test stadium',
              opened: 1925,
              capacity: 59590,
              location: 'awesome location',
              team_id: response.body[1].id,
            })
            .end((request, response) => {
              expect(response.status).to.equal(201);
              expect(response.body).have.property('name');
              expect(response.body).have.property('opened');
              expect(response.body).have.property('capacity');
              expect(response.body).have.property('location');
              expect(response.body).have.property('team_id');
              done();
            });
        });
    });

    it('Test create venue with invalid data should return 400', (done) => {
      const invalidPayload = {
        name: 'test stadium',
        opened: 1905,
        capacity: 30590,
        location: 'some awesome',
      };

      chai
        .request(server)
        .post('/v1/venues')
        .send(invalidPayload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          done();
        });
    });
  });

  describe('List venues', () => {
    it('Test list venues should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/venues')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0]).have.property('id');
          expect(response.body[0]).have.property('name');
          expect(response.body[0]).have.property('location');
          done();
        });
    });

    it('Test list venues pagination without number should return 400', (done) => {
      chai
        .request(server)
        .get('/v1/venues?page=j')
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('"page" must be a number');
          done();
        });
    });
  });

  describe('Find venue by id', () => {
    it('Test find venue by id should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/venues')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/v1/venues/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).have.property('name');
              expect(response.body).have.property('opened');
              expect(response.body).have.property('capacity');
              expect(response.body).have.property('location');
              expect(response.body).have.property('team');
              done();
            });
        });
    });
  });

  describe('Update venues', () => {
    it('Test update venue should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/venues')
        .end((request, response) => {
          expect(response.body[0].opened).is.not.equal(1938);
          expect(response.body[0].capacity).is.not.equal(45000);
          chai
            .request(server)
            .put(`/v1/venues/${response.body[0].id}`)
            .send({ opened: 1938, capacity: 45000 })
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.opened).to.equal(1938);
              expect(response.body.capacity).to.equal(45000);
              expect(response.body).have.property('id');
              expect(response.body).have.property('name');
              expect(response.body).have.property('opened');
              expect(response.body).have.property('capacity');
              expect(response.body).have.property('location');
              expect(response.body).have.property('team_id');
              done();
            });
        });
    });

    it('Test update with invalid data should return 400', (done) => {
      chai
        .request(server)
        .get('/v1/venues')
        .end((request, response) => {
          chai
            .request(server)
            .put(`/v1/venues/${response.body[0].id}`)
            .send({ name: 'some' })
            .end((request, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.message).to.equal(
                '"name" length must be at least 7 characters long'
              );
              done();
            });
        });
    });

    describe('Delete venue', () => {
      it('Test delete venue should return 204', (done) => {
        chai
          .request(server)
          .get('/v1/venues')
          .end((request, response) => {
            chai
              .request(server)
              .delete(`/v1/venues/${response.body[0].id}`)
              .end((request, response) => {
                expect(response.status).to.equal(204);
                done();
              });
          });
      });
    });
  });
});
