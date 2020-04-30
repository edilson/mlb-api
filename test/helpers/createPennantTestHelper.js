const connection = require('../../src/database/connection');

module.exports = async (
  dateStarted,
  dateFinished,
  pennantWinner,
  pennantRunnersUp
) => {
  const pennant = {
    start_date: dateStarted,
    end_date: dateFinished,
    champion_id: pennantWinner,
    runners_up_id: pennantRunnersUp,
  };

  const { start_date, end_date, champion_id, runners_up_id } = pennant;

  await connection('pennant').insert({
    start_date,
    end_date,
    champion_id,
    runners_up_id,
  });

  const createdPennant = await connection('pennant')
    .where('champion_id', pennantWinner)
    .select('*')
    .first();

  return createdPennant;
};
