const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../createTeamTestHelper');
const createVenueTestHelper = require('../createVenueTestHelper');
const createWorldSeriesTestHelper = require('../createWorldSeriesTestHelper');

chai.use(chaiHttp);

describe('Team Properties', () => {
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
    const secondTeam = await createTeamTestHelper(
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

    await createWorldSeriesTestHelper(
      new Date(2010, 10 - 1, 25),
      new Date(2010, 11 - 1, 5),
      firstTeam.id,
      secondTeam.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Get venue', () => {
    it('Test get team venue should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/teams/${response.body[0].id}/venue`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
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
  });

  describe('Get World Series', () => {
    it('Test get team world series should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/teams/${response.body[0].id}/world_series`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body[0]).have.property('start_date');
              expect(response.body[0]).have.property('end_date');
              expect(response.body[0]).have.property('champion_id');
              expect(response.body[0]).have.property('runners_up_id');
              done();
            });
        });
    });
  });
});
