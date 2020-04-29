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
  let firstTeam, secondTeam, firstVenue, firstWorldSeries;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

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

    firstWorldSeries = await createWorldSeriesTestHelper(
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
    it('should return team venue', (done) => {
      chai
        .request(server)
        .get(`/api/v1/teams/${firstTeam.id}/venue`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(firstVenue.id);
          expect(response.body.name).to.equal(firstVenue.name);
          expect(response.body.opened).to.equal(
            firstVenue.opened.toISOString()
          );
          expect(response.body.capacity).to.equal(firstVenue.capacity);
          expect(response.body.location).to.equal(firstVenue.location);
          expect(response.body.team_id).to.equal(firstVenue.team_id);
          done();
        });
    });
  });

  describe('Get World Series', () => {
    it('Test get team world series should return 200', (done) => {
      chai
        .request(server)
        .get(`/api/v1/teams/${firstTeam.id}/world_series`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
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
  });
});
