const connection = require('../../src/database/connection');

module.exports = async (
  dateStarted,
  dateFinished,
  divisionSeriesWinner,
  divisionSeriesWinningRecord
) => {
  const divisionSeries = {
    start_date: dateStarted,
    end_date: dateFinished,
    champion_id: divisionSeriesWinner,
    record: divisionSeriesWinningRecord,
  };

  const { start_date, end_date, champion_id, record } = divisionSeries;

  await connection('division_series').insert({
    start_date,
    end_date,
    champion_id,
    record,
  });

  const createdDivisionSeries = await connection('division_series')
    .where('champion_id', divisionSeriesWinner)
    .select('*')
    .first();

  return createdDivisionSeries;
};
