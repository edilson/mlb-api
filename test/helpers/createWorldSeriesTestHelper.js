const connection = require('../../src/database/connection');

module.exports = async (
  dateStarted,
  dateFinished,
  worldSeriesWinner,
  worldSeriesRunnersUp
) => {
  const worldSeries = {
    start_date: dateStarted,
    end_date: dateFinished,
    champion_id: worldSeriesWinner,
    runners_up_id: worldSeriesRunnersUp,
  };

  const { start_date, end_date, champion_id, runners_up_id } = worldSeries;

  await connection('world_series').insert({
    start_date,
    end_date,
    champion_id,
    runners_up_id,
  });

  const createdWorldSeries = await connection('world_series')
    .where('champion_id', worldSeriesWinner)
    .select('*')
    .first();

  return createdWorldSeries;
};
