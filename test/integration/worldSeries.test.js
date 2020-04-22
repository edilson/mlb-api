const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');
const createTeamTestHelper = require('../createTeamTestHelper');

chai.use(chaiHttp);

describe('World Series', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    const firstTeam = await createTeamTestHelper();
    const secondTeam = await createTeamTestHelper();
    await createTeamTestHelper();
    await createTeamTestHelper();

    const firstWorldSeries = {
      start_date: '2010-10-28',
      end_date: '2010-11-08',
      champion_id: firstTeam.id,
      runners_up_id: secondTeam.id,
    };

    const {
      start_date,
      end_date,
      champion_id,
      runners_up_id,
    } = firstWorldSeries;

    await connection('world_series').insert({
      start_date,
      end_date,
      champion_id,
      runners_up_id,
    });
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create World Series', () => {
    it('Test create world series should return 201', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .post('/api/v1/world_series')
            .send({
              start_date: '2011-10-25',
              end_date: '2011-11-03',
              champion_id: response.body[2].id,
              runners_up_id: response.body[3].id,
            })
            .end((request, response) => {
              expect(response.status).to.equal(201);
              expect(response.body).have.property('start_date');
              expect(response.body).have.property('end_date');
              expect(response.body).have.property('champion_id');
              expect(response.body).have.property('runners_up_id');
              done();
            });
        });
    });

    it('Test create world series with invalid data should return 400', (done) => {
      const invalidPayload = {
        start_date: '2014-10-29',
        end_date: '2014-11-05',
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
    it('Test list world series should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body[0]).have.property('id');
          expect(response.body[0]).have.property('start_date');
          expect(response.body[0]).have.property('end_date');
          expect(response.body[0]).have.property('champion_id');
          expect(response.body[0]).have.property('runners_up_id');
          done();
        });
    });

    it('Test list world series pagination without number should return 400', (done) => {
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
    it('Test find world series by id should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/world_series/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).have.property('id');
              expect(response.body).have.property('start_date');
              expect(response.body).have.property('end_date');
              expect(response.body).have.property('champion_id');
              expect(response.body).have.property('runners_up_id');
              done();
            });
        });
    });
  });

  describe('Update world series', () => {
    it('Test update world series should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          chai
            .request(server)
            .put(`/api/v1/world_series/${response.body[0].id}`)
            .send({ start_date: '2012-10-23', end_date: '2012-11-02' })
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).have.property('id');
              expect(response.body).have.property('start_date');
              expect(response.body).have.property('end_date');
              expect(response.body).have.property('champion_id');
              expect(response.body).have.property('runners_up_id');
              done();
            });
        });
    });
  });

  describe('Delete world series', () => {
    it('Test delete should return 204', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          chai
            .request(server)
            .delete(`/api/v1/world_series/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(204);
              done();
            });
        });
    });
  });
});
