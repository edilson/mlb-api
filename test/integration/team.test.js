const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../createTeamTestHelper');
const createVenueTestHelper = require('../createVenueTestHelper');

chai.use(chaiHttp);

describe('Teams', () => {
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
    await createVenueTestHelper(
      'first-venue',
      new Date(1955, 12 - 1, 13),
      55900,
      'somewhere i belong',
      firstTeam.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Team', () => {
    const payload = {
      name: 'test-team',
      established_in: 1880,
      league: 'testing league1',
      division: 'testing division',
      logo: 'some logo',
      number_of_titles: 0,
    };

    const invalidPayload = {
      name: 'test-team',
      established_in: 1870,
      league: 'testing league',
      division: 'test division',
      logo: 'some logo',
      number_of_titles: '',
    };

    it('Test create team should return 201', (done) => {
      chai
        .request(server)
        .post('/api/v1/teams')
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          expect(response.body.name).to.equal(payload.name);
          expect(response.body.established_in).to.equal(payload.established_in);
          expect(response.body.league).to.equal(payload.league);
          expect(response.body.division).to.equal(payload.division);
          expect(response.body.logo).to.equal(payload.logo);
          expect(response.body.number_of_titles).to.equal(
            payload.number_of_titles
          );
          done();
        });
    });

    it('Test create team with invalid data should return 400', (done) => {
      chai
        .request(server)
        .post('/api/v1/teams')
        .send(invalidPayload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          done();
        });
    });
  });

  describe('List teams', () => {
    it('Test list team should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0]).have.property('id');
          expect(response.body[0]).have.property('name');
          expect(response.body[0]).have.property('established_in');
          expect(response.body[0]).have.property('league');
          expect(response.body[0]).have.property('division');
          expect(response.body[0]).have.property('logo');
          expect(response.body[0]).have.property('number_of_titles');
          done();
        });
    });

    it('Test list team pagination without number should return 400', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams?page=n')
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('"page" must be a number');
          done();
        });
    });
  });

  describe('Find team by id', () => {
    it('Test find team by id should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/teams/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).have.property('id');
              expect(response.body).have.property('name');
              expect(response.body).have.property('established_in');
              expect(response.body).have.property('league');
              expect(response.body).have.property('division');
              expect(response.body).have.property('logo');
              expect(response.body).have.property('number_of_titles');
              expect(response.body).have.property('venue');
              done();
            });
        });
    });
  });

  describe('Update team', () => {
    it('Test update team should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          expect(response.body[0].name).is.not.equal('first_team');
          chai
            .request(server)
            .put(`/api/v1/teams/${response.body[0].id}`)
            .send({ name: 'first_team' })
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.name).to.equal('first_team');
              expect(response.body).has.property('id');
              expect(response.body).has.property('established_in');
              expect(response.body).has.property('league');
              expect(response.body).has.property('division');
              expect(response.body).has.property('logo');
              expect(response.body).has.property('number_of_titles');
              done();
            });
        });
    });

    it('Test update team with invalid data should return 400', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .put(`/api/v1/teams/${response.body[0].id}`)
            .send({ name: 'first_team', established_in: 1870 })
            .end((request, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.message).to.equal(
                '"established_in" must be larger than or equal to 1871'
              );
              done();
            });
        });
    });
  });

  describe('Delete team', () => {
    it('Test delete team should return 204', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .delete(`/api/v1/teams/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(204);
              done();
            });
        });
    });
  });
});
