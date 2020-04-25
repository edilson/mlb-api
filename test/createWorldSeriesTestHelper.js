const connection = require('../src/database/connection');

module.exports = async (
  date_started,
  date_finished,
  world_series_winner,
  world_series_runners_up
) => {
  const worldSeries = {
    start_date: date_started,
    end_date: date_finished,
    champion_id: world_series_winner,
    runners_up_id: world_series_runners_up,
  };

  const { start_date, end_date, champion_id, runners_up_id } = worldSeries;

  await connection('world_series').insert({
    start_date,
    end_date,
    champion_id,
    runners_up_id,
  });

  const createdWorldSeries = await connection('world_series')
    .where('champion_id', world_series_winner)
    .select('*')
    .first();

  return createdWorldSeries;
};
