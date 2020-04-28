const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../createTeamTestHelper');
const createVenueTestHelper = require('../createVenueTestHelper');
const createWorldSeriesTestHelper = require('../createWorldSeriesTestHelper');

chai.use(chaiHttp);

describe('Games', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    const firstTeam = await createTeamTestHelper();
    const secondTeam = await createTeamTestHelper();

    const firstVenue = await createVenueTestHelper(firstTeam.id);

    const firstWorldSeries = await createWorldSeriesTestHelper(
      new Date(2010, 10 - 1, 25),
      new Date(2010, 11 - 1, 5),
      firstTeam.id,
      secondTeam.id
    );

    const firstGame = {
      event_date: new Date(2010, 10 - 1, 25),
      venue_id: firstVenue.id,
      winner_id: firstTeam.id,
      loser_id: secondTeam.id,
      winner_score: 8,
      loser_score: 4,
      world_series_id: firstWorldSeries.id,
    };

    const {
      event_date,
      venue_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
      world_series_id,
    } = firstGame;

    await connection('game').insert({
      event_date,
      venue_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
      world_series_id,
    });
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('List world series games', () => {
    it('Test list world series games should return 200', (done) => {
      chai
        .request(server)
        .get('/api/v1/world_series')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/api/v1/world_series/${response.body[0].id}/games`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              done();
            });
        });
    });
  });
});
