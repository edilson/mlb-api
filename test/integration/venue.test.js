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

    const firstTeam = await createTeamTestHelper(
      'first-team',
      1899,
      'American League',
      'East Division',
      'some awesome logo',
      2
    );
    await createTeamTestHelper(
      'second-team',
      1880,
      'National League',
      'West Division',
      'some excelent logo',
      5
    );

    await createVenueTestHelper(
      'first-venue',
      new Date(1912, 10 - 1, 23),
      45900,
      'somewhere i belong',
      firstTeam.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Venue', () => {
    it('Test create venue should return 201', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          const payload = {
            name: 'test stadium',
            opened: new Date(1925, 2 - 1, 23),
            capacity: 59590,
            location: 'awesome location',
            team_id: response.body[1].id,
          };

          chai
            .request(server)
            .post('/api/v1/venues')
            .send(payload)
            .end((request, response) => {
              expect(response.status).to.equal(201);
              expect(response.body.name).to.equal(payload.name);
              expect(response.body.opened).to.equal(
                payload.opened.toISOString()
              );
              expect(response.body.capacity).to.equal(payload.capacity);
              expect(response.body.location).to.equal(payload.location);
              expect(response.body.team_id).to.equal(payload.team_id);
              done();
            });
        });
    });

    it('Test create venue with invalid data should return 400', (done) => {
      const invalidPayload = {
        name: 'test stadium',
        opened: new Date(1905, 3 - 1, 12),
        capacity: 30590,
        location: 'some awesome',
      };

      chai
        .request(server)
        .post('/api/v1/venues')
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
        .get('/api/v1/venues')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0]).have.property('id');
          expect(response.body[0]).have.property('name');
          expect(response.body[0]).have.property('opened');
          expect(response.body[0]).have.property('capacity');
          expect(response.body[0]).have.property('location');
          expect(response.body[0]).have.property('team');
          done();
        });
    });

    it('Test list venues pagination without number should return 400', (done) => {
      chai
        .request(server)
        .get('/api/v1/venues?page=j')
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
        .get('/api/v1/venues')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/venues/${response.body[0].id}`)
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
        .get('/api/v1/venues')
        .end((request, response) => {
          const payload = {
            name: 'some awesome name',
            capacity: 45000,
            location: 'anywhere',
          };

          chai
            .request(server)
            .put(`/api/v1/venues/${response.body[0].id}`)
            .send(payload)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.name).to.equal(payload.name);
              expect(response.body.capacity).to.equal(payload.capacity);
              expect(response.body.location).to.equal(payload.location);
              expect(response.body).have.property('id');
              expect(response.body).have.property('team_id');
              done();
            });
        });
    });

    it('Test update with invalid data should return 400', (done) => {
      chai
        .request(server)
        .get('/api/v1/venues')
        .end((request, response) => {
          chai
            .request(server)
            .put(`/api/v1/venues/${response.body[0].id}`)
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
          .get('/api/v1/venues')
          .end((request, response) => {
            chai
              .request(server)
              .delete(`/api/v1/venues/${response.body[0].id}`)
              .end((request, response) => {
                expect(response.status).to.equal(204);
                done();
              });
          });
      });
    });
  });
});
