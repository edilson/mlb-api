const connection = require('../src/database/connection');

module.exports = async (
  gameDate,
  gameVenue,
  gameWinner,
  gameLoser,
  gameWinnerScore,
  gameLoserScore,
  gameWorldSeriesId
) => {
  const game = {
    event_date: gameDate,
    venue_id: gameVenue,
    winner_id: gameWinner,
    loser_id: gameLoser,
    winner_score: gameWinnerScore,
    loser_score: gameLoserScore,
    world_series_id: gameWorldSeriesId,
  };

  const {
    event_date,
    venue_id,
    winner_id,
    loser_id,
    winner_score,
    loser_score,
    world_series_id,
  } = game;

  await connection('game').insert({
    event_date,
    venue_id,
    winner_id,
    loser_id,
    winner_score,
    loser_score,
    world_series_id,
  });

  const createdGame = await connection('game')
    .where('world_series_id', gameWorldSeriesId)
    .select('*')
    .first();

  return createdGame;
};
