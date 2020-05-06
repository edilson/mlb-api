const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const connection = require('../../src/database/connection');
const server = require('../../server');

const createTeamTestHelper = require('../helpers/createTeamTestHelper');
const createVenueTestHelper = require('../helpers/createVenueTestHelper');
const createWorldSeriesTestHelper = require('../helpers/createWorldSeriesTestHelper');
const createGameTestHelper = require('../helpers/createGameTestHelper');

chai.use(chaiHttp);

describe('Games', () => {
  let firstTeam,
    secondTeam,
    firstVenue,
    firstWorldSeries,
    firstGame,
    user,
    token;

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
      new Date(1942, 10 - 1, 23),
      48900,
      'somewhere i belong',
      firstTeam.id
    );

    firstWorldSeries = await createWorldSeriesTestHelper(
      new Date(2010, 10 - 1, 25),
      new Date(2010, 11 - 1, 5),
      firstTeam.id,
      secondTeam.id
    );

    firstGame = await createGameTestHelper(
      new Date(2010, 10 - 1, 25),
      firstVenue.id,
      firstTeam.id,
      secondTeam.id,
      12,
      9,
      firstWorldSeries.id
    );
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create world series games', () => {
    it('should create world series game', (done) => {
      const payload = {
        event_date: new Date(2013, 10 - 1, 23),
        venue_id: firstVenue.id,
        winner_id: firstTeam.id,
        loser_id: secondTeam.id,
        winner_score: 13,
        loser_score: 11,
      };

      chai
        .request(server)
        .post(`/api/v1/world_series/${firstWorldSeries.id}/games`)
        .set('Authorization', token)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          expect(response.body.event_date).to.equal(
            payload.event_date.toISOString()
          );
          expect(response.body.venue_id).to.equal(payload.venue_id);
          expect(response.body.winner_id).to.equal(payload.winner_id);
          expect(response.body.loser_id).to.equal(payload.loser_id);
          expect(response.body.winner_score).to.equal(payload.winner_score);
          expect(response.body.loser_score).to.equal(payload.loser_score);
          expect(response.body).have.property(
            'world_series_id',
            firstWorldSeries.id
          );
          done();
        });
    });
  });

  describe('List world series games', () => {
    it('should list world series games', (done) => {
      chai
        .request(server)
        .get(`/api/v1/world_series/${firstWorldSeries.id}/games`)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body[0].event_date).to.equal(
            firstGame.event_date.toISOString()
          );
          expect(response.body[0].venue_id).to.equal(firstGame.venue_id);
          expect(response.body[0].winner_id).to.equal(firstGame.winner_id);
          expect(response.body[0].loser_id).to.equal(firstGame.loser_id);
          expect(response.body[0].winner_score).to.equal(
            firstGame.winner_score
          );
          expect(response.body[0].loser_score).to.equal(firstGame.loser_score);
          expect(response.body[0].world_series_id).to.equal(
            firstGame.world_series_id
          );
          expect(response.body).to.have.length(1);
          done();
        });
    });
  });

  describe('Get world series game by id', () => {
    it('should return world series game requested', (done) => {
      chai
        .request(server)
        .get(
          `/api/v1/world_series/${firstWorldSeries.id}/games/${firstGame.id}`
        )
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.event_date).to.equal(
            firstGame.event_date.toISOString()
          );
          expect(response.body.venue_id).to.equal(firstGame.venue_id);
          expect(response.body.winner_id).to.equal(firstGame.winner_id);
          expect(response.body.loser_id).to.equal(firstGame.loser_id);
          expect(response.body.winner_score).to.equal(firstGame.winner_score);
          expect(response.body.loser_score).to.equal(firstGame.loser_score);
          expect(response.body.world_series_id).to.equal(
            firstGame.world_series_id
          );
          done();
        });
    });
  });

  describe('Update world series game by id', () => {
    it('should update world series game', (done) => {
      const payload = {
        event_date: new Date(2010, 10 - 1, 27),
        winner_score: 18,
        loser_score: 15,
      };

      chai
        .request(server)
        .put(
          `/api/v1/world_series/${firstWorldSeries.id}/games/${firstGame.id}`
        )
        .set('Authorization', token)
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.event_date).to.equal(
            payload.event_date.toISOString()
          );
          expect(response.body.venue_id).to.equal(firstGame.venue_id);
          expect(response.body.winner_id).to.equal(firstGame.winner_id);
          expect(response.body.loser_id).to.equal(firstGame.loser_id);
          expect(response.body.winner_score).to.equal(payload.winner_score);
          expect(response.body.loser_score).to.equal(payload.loser_score);
          expect(response.body.world_series_id).to.equal(
            firstGame.world_series_id
          );
          done();
        });
    });
  });

  describe('Delete world series game by id', () => {
    it('should delete world series game', (done) => {
      chai
        .request(server)
        .delete(
          `/api/v1/world_series/${firstWorldSeries.id}/games/${firstGame.id}`
        )
        .set('Authorization', token)
        .end((request, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
});
