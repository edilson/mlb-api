const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createVenueTestHelper = require('../helpers/createVenueTestHelper');

chai.use(chaiHttp);

describe('Teams', () => {
  let firstTeam, secondTeam, firstVenue, user, token;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    user = {
      email: 'edilson.silva00@hotmail.com',
      senha: '123ab',
    };

    token = await jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' });

    firstTeam = await createTeamTestHelper(
      'first-team',
      1899,
      'American League',
      'East Division',
      'some awesome logo',
      2
    );
    secondTeam = await createTeamTestHelper(
      'second-team',
      1888,
      'National League',
      'Central Division',
      'some cool logo',
      9
    );
    firstVenue = await createVenueTestHelper(
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
    it('should create team', (done) => {
      const payload = {
        name: 'test-team',
        established_in: 1880,
        league: 'testing league1',
        division: 'testing division',
        logo: 'some logo',
        number_of_titles: 0,
      };

      chai
        .request(server)
        .post('/api/v1/teams')
        .set('Authorization', token)
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
  });

  describe('List teams', () => {
    it('should list teams', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0].id).to.equal(firstTeam.id);
          expect(response.body[0].name).to.equal(firstTeam.name);
          expect(response.body[0].established_in).to.equal(
            firstTeam.established_in
          );
          expect(response.body[0].league).to.equal(firstTeam.league);
          expect(response.body[0].division).to.equal(firstTeam.division);
          expect(response.body[0].logo).to.equal(firstTeam.logo);
          expect(response.body[0].number_of_titles).to.equal(
            firstTeam.number_of_titles
          );
          done();
        });
    });

    it('should return 400 with invalid pagination value', (done) => {
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
    it('should find requested team by id', (done) => {
      const { name, opened, capacity, location, team_id } = firstVenue;

      chai
        .request(server)
        .get(`/api/v1/teams/${firstTeam.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstTeam.id);
          expect(response.body.name).to.equal(firstTeam.name);
          expect(response.body.established_in).to.equal(
            firstTeam.established_in
          );
          expect(response.body.league).to.equal(firstTeam.league);
          expect(response.body.division).to.equal(firstTeam.division);
          expect(response.body.logo).to.equal(firstTeam.logo);
          expect(response.body.number_of_titles).to.equal(
            firstTeam.number_of_titles
          );

          expect(response.body.venue.name).to.equal(name);
          expect(response.body.venue.opened).to.equal(opened.toISOString());
          expect(response.body.venue.capacity).to.equal(capacity);
          expect(response.body.venue.location).to.equal(location);
          expect(response.body.venue.team_id).to.equal(team_id);
          done();
        });
    });
  });

  describe('Update team', () => {
    it('should update team', (done) => {
      chai
        .request(server)
        .put(`/api/v1/teams/${firstTeam.id}`)
        .set('Authorization', token)
        .send({ name: 'first-team-updated' })
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstTeam.id);
          expect(response.body.name).to.equal('first-team-updated');
          expect(response.body.established_in).to.equal(
            firstTeam.established_in
          );
          expect(response.body.league).to.equal(firstTeam.league);
          expect(response.body.division).to.equal(firstTeam.division);
          expect(response.body.logo).to.equal(firstTeam.logo);
          expect(response.body.number_of_titles).to.equal(
            firstTeam.number_of_titles
          );
          done();
        });
    });
  });

  describe('Delete team', () => {
    it('should delete team', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/teams/${secondTeam.id}`)
        .set('Authorization', token)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
