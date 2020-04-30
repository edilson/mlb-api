const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createPennantTestHelper = require('../helpers/createPennantTestHelper');

chai.use(chaiHttp);

describe('Pennants', () => {
  let firstTeam, secondTeam, firstPennant;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    firstTeam = await createTeamTestHelper(
      'first-team',
      1890,
      'American League',
      'West Division',
      'some excelent logo',
      9
    );

    secondTeam = await createTeamTestHelper(
      'second-team',
      1880,
      'National League',
      'West Division',
      'some excelent logo',
      5
    );

    firstPennant = await createPennantTestHelper(
      new Date(2010, 10 - 1, 28),
      new Date(2010, 11 - 1, 8),
      firstTeam.id,
      secondTeam.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Pennant', () => {
    it('should create pennant', (done) => {
      const payload = {
        start_date: new Date(2011, 10 - 1, 25),
        end_date: new Date(2011, 11 - 1, 3),
        champion_id: firstTeam.id,
        runners_up_id: secondTeam.id,
      };

      chai
        .request(server)
        .post('/api/v1/pennants')
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          expect(response.body.start_date).to.equal(
            payload.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            payload.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(payload.champion_id);
          expect(response.body.runners_up_id).to.equal(payload.runners_up_id);
          done();
        });
    });

    it('should return 400 with invalid data', (done) => {
      const invalidPayload = {
        start_date: new Date(2014, 10 - 1, 29),
        end_date: new Date(2014, 11 - 1, 5),
      };

      chai
        .request(server)
        .post('/api/v1/pennants')
        .send(invalidPayload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          done();
        });
    });
  });

  describe('List pennants', () => {
    it('should list pennants', (done) => {
      chai
        .request(server)
        .get('/api/v1/pennants')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body[0].id).to.equal(firstPennant.id);
          expect(response.body[0].start_date).to.equal(
            firstPennant.start_date.toISOString()
          );
          expect(response.body[0].end_date).to.equal(
            firstPennant.end_date.toISOString()
          );
          expect(response.body[0].champion_id).to.equal(
            firstPennant.champion_id
          );
          expect(response.body[0].runners_up_id).to.equal(
            firstPennant.runners_up_id
          );
          done();
        });
    });

    it('should return 400 with invalid pagination value', (done) => {
      chai
        .request(server)
        .get('/api/v1/pennants?page=m')
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('"page" must be a number');
          done();
        });
    });
  });

  describe('Find pennant by id', () => {
    it('should find pennant by id', (done) => {
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
        .get(`/api/v1/pennants/${firstPennant.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstPennant.id);
          expect(response.body.start_date).to.equal(
            firstPennant.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            firstPennant.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(firstPennant.champion_id);
          expect(response.body.runners_up_id).to.equal(
            firstPennant.runners_up_id
          );

          expect(response.body.champion.name).to.equal(name);
          expect(response.body.champion.established_in).to.equal(
            established_in
          );
          expect(response.body.champion.league).to.equal(league);
          expect(response.body.champion.division).to.equal(division);
          expect(response.body.champion.logo).to.equal(logo);
          expect(response.body.champion.number_of_titles).to.equal(
            number_of_titles
          );
          done();
        });
    });
  });

  describe('Update pennant', () => {
    it('should update pennant', (done) => {
      const payload = {
        start_date: new Date(2012, 10 - 1, 23),
        end_date: new Date(2012, 11 - 1, 2),
      };

      chai
        .request(server)
        .put(`/api/v1/pennants/${firstPennant.id}`)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstPennant.id);
          expect(response.body.start_date).to.equal(
            payload.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            payload.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(firstPennant.champion_id);
          expect(response.body.runners_up_id).to.equal(
            firstPennant.runners_up_id
          );
          done();
        });
    });
  });

  describe('Delete pennant', () => {
    it('should delete pennant', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/pennants/${firstPennant.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
