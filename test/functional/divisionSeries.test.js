const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createDivisionSeriesTestHelper = require('../helpers/createDivisionSeriesTestHelper');

chai.use(chaiHttp);

describe('Division Series', () => {
  let firstTeam, firstDivisionSeries, token, user;

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

    firstDivisionSeries = await createDivisionSeriesTestHelper(
      new Date(2018, 3 - 1, 23),
      new Date(2018, 9 - 1, 30),
      firstTeam.id,
      '110-52'
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Division Series', () => {
    it('should create division series', (done) => {
      const payload = {
        start_date: new Date(2019, 3 - 1, 20),
        end_date: new Date(2019, 9 - 1, 29),
        champion_id: firstTeam.id,
        record: '103-59',
      };

      chai
        .request(server)
        .post('/api/v1/division_series')
        .set('Authorization', token)
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
          expect(response.body.record).to.equal(payload.record);
          done();
        });
    });
  });

  describe('List Division Series', () => {
    it('should list division series', (done) => {
      chai
        .request(server)
        .get('/api/v1/division_series')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.header).have.property('x-total-count');
          expect(response.body[0].id).to.equal(firstDivisionSeries.id);
          expect(response.body[0].start_date).to.equal(
            firstDivisionSeries.start_date.toISOString()
          );
          expect(response.body[0].end_date).to.equal(
            firstDivisionSeries.end_date.toISOString()
          );
          expect(response.body[0].champion_id).to.equal(
            firstDivisionSeries.champion_id
          );
          expect(response.body[0].record).to.equal(firstDivisionSeries.record);
          expect(response.body).to.have.length(1);
          done();
        });
    });
  });

  describe('Get Division Series by id', () => {
    it('should return the request division series', (done) => {
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
        .get(`/api/v1/division_series/${firstDivisionSeries.id}`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.start_date).to.equal(
            firstDivisionSeries.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            firstDivisionSeries.end_date.toISOString()
          );
          expect(response.body.champion_id).to.equal(
            firstDivisionSeries.champion_id
          );
          expect(response.body.record).to.equal(firstDivisionSeries.record);

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

  describe('Update Division Series', () => {
    it('should update division series', (done) => {
      const payload = {
        start_date: new Date(2010, 3 - 1, 21),
        end_date: new Date(2010, 9 - 1, 30),
        record: '100-62',
      };

      chai
        .request(server)
        .put(`/api/v1/division_series/${firstDivisionSeries.id}`)
        .set('Authorization', token)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.start_date).to.equal(
            payload.start_date.toISOString()
          );
          expect(response.body.end_date).to.equal(
            payload.end_date.toISOString()
          );
          expect(response.body.record).to.equal(payload.record);
          expect(response.body.champion_id).to.equal(
            firstDivisionSeries.champion_id
          );
          done();
        });
    });
  });

  describe('Delete Division Series', () => {
    it('should delete division series', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/division_series/${firstDivisionSeries.id}`)
        .set('Authorization', token)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
