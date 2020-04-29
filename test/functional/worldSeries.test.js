const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createWorldSeriesTestHelper = require('../helpers/createWorldSeriesTestHelper');

chai.use(chaiHttp);

describe('World Series', () => {
  let firstTeam, secondTeam, firstWorldSeries;

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

    firstWorldSeries = await createWorldSeriesTestHelper(
      new Date(2010, 10 - 1, 28),
      new Date(2010, 11 - 1, 8),
      firstTeam.id,
      secondTeam.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create World Series', () => {
    it('should create world series', (done) => {
      const payload = {
        start_date: new Date(2011, 10 - 1, 25),
        end_date: new Date(2011, 11 - 1, 3),
        champion_id: firstTeam.id,
        runners_up_id: secondTeam.id,
      };

      chai
        .request(server)
        .post('/api/v1/world_series')
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

    it('create world series should return 400 with invalid data', (done) => {
      const invalidPayload = {
        start_date: new Date(2014, 10 - 1, 29),
        end_date: new Date(2014, 11 - 1, 5),
      };

      chai
        .request(server)
        .post('/api/v1/world_series')
        .send(invalidPayload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          done();
        });
    });
  });

  describe('List world series', () => {
    it('should list world series', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body[0].id).to.equal(firstWorldSeries.id);
          expect(response.body[0].start_date).to.equal(
            firstWorldSeries.start_date.toISOString()
          );
          expect(response.body[0].end_date).to.equal(
            firstWorldSeries.end_date.toISOString()
          );
          expect(response.body[0].champion_id).to.equal(
            firstWorldSeries.champion_id
          );
          expect(response.body[0].runners_up_id).to.equal(
            firstWorldSeries.runners_up_id
          );
          done();
        });
    });

    it('should return 400 with invalid pagination value', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series?page=m')
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('"page" must be a number');
          done();
        });
    });
  });

  describe('Find world series by id', () => {
    it('should find world series by id', (done) => {
      chai
        .request(server)
        .get(`/api/v1/world_series/${firstWorldSeries.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstWorldSeries.id);
          expect(response.body.start_date).to.equal(
            firstWorldSeries.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            firstWorldSeries.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(
            firstWorldSeries.champion_id
          );
          expect(response.body.runners_up_id).to.equal(
            firstWorldSeries.runners_up_id
          );
          done();
        });
    });
  });

  describe('Update world series', () => {
    it('Test update world series should return 200', (done) => {
      const payload = {
        start_date: new Date(2012, 10 - 1, 23),
        end_date: new Date(2012, 11 - 1, 2),
      };

      chai
        .request(server)
        .put(`/api/v1/world_series/${firstWorldSeries.id}`)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstWorldSeries.id);
          expect(response.body.start_date).to.equal(
            payload.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            payload.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(
            firstWorldSeries.champion_id
          );
          expect(response.body.runners_up_id).to.equal(
            firstWorldSeries.runners_up_id
          );
          done();
        });
    });
  });

  describe('Delete world series', () => {
    it('Test delete should return 204', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/world_series/${firstWorldSeries.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
