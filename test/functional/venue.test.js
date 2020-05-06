const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createVenueTestHelper = require('../helpers/createVenueTestHelper');

chai.use(chaiHttp);

describe('Venues', () => {
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
      1880,
      'National League',
      'West Division',
      'some excelent logo',
      5
    );

    firstVenue = await createVenueTestHelper(
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
    it('should create venue', (done) => {
      const payload = {
        name: 'test stadium',
        opened: new Date(1925, 2 - 1, 23),
        capacity: 59590,
        location: 'awesome location',
        team_id: secondTeam.id,
      };

      chai
        .request(server)
        .post('/api/v1/venues')
        .set('Authorization', token)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          expect(response.body.name).to.equal(payload.name);
          expect(response.body.opened).to.equal(payload.opened.toISOString());
          expect(response.body.capacity).to.equal(payload.capacity);
          expect(response.body.location).to.equal(payload.location);
          expect(response.body.team_id).to.equal(payload.team_id);
          done();
        });
    });
  });

  describe('List venues', () => {
    it('should list venues', (done) => {
      const {
        name,
        established_in,
        league,
        division,
        logo,
        number_of_titles,
      } = firstTeam;

      chai
        .request(server)
        .get('/api/v1/venues')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0].id).to.equal(firstVenue.id);
          expect(response.body[0].name).to.equal(firstVenue.name);
          expect(response.body[0].opened).to.equal(
            firstVenue.opened.toISOString()
          );
          expect(response.body[0].capacity).to.equal(firstVenue.capacity);
          expect(response.body[0].location).to.equal(firstVenue.location);

          expect(response.body[0].team.name).to.equal(name);
          expect(response.body[0].team.established_in).to.equal(established_in);
          expect(response.body[0].team.league).to.equal(league);
          expect(response.body[0].team.division).to.equal(division);
          expect(response.body[0].team.logo).to.equal(logo);
          expect(response.body[0].team.number_of_titles).to.equal(
            number_of_titles
          );
          done();
        });
    });

    it('should return 400 with invalid pagination value', (done) => {
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
    it('should find venue by id', (done) => {
      const {
        name,
        established_in,
        league,
        division,
        logo,
        number_of_titles,
      } = firstTeam;

      chai
        .request(server)
        .get(`/api/v1/venues/${firstVenue.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstVenue.id);
          expect(response.body.name).to.equal(firstVenue.name);
          expect(response.body.opened).to.equal(
            firstVenue.opened.toISOString()
          );
          expect(response.body.capacity).to.equal(firstVenue.capacity);
          expect(response.body.location).to.equal(firstVenue.location);

          expect(response.body.team.name).to.equal(name);
          expect(response.body.team.established_in).to.equal(established_in);
          expect(response.body.team.league).to.equal(league);
          expect(response.body.team.division).to.equal(division);
          expect(response.body.team.logo).to.equal(logo);
          expect(response.body.team.number_of_titles).to.equal(
            number_of_titles
          );
          done();
        });
    });
  });

  describe('Update venues', () => {
    it('should update venue', (done) => {
      const payload = {
        name: 'some awesome name',
        capacity: 45000,
        location: 'anywhere',
      };

      chai
        .request(server)
        .put(`/api/v1/venues/${firstVenue.id}`)
        .set('Authorization', token)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(payload.name);
          expect(response.body.capacity).to.equal(payload.capacity);
          expect(response.body.location).to.equal(payload.location);
          expect(response.body.id).to.equal(firstVenue.id);
          expect(response.body.team_id).to.equal(firstVenue.team_id);
          done();
        });
    });
  });

  describe('Delete venue', () => {
    it('Test delete venue should return 204', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/venues/${firstVenue.id}`)
        .set('Authorization', token)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
