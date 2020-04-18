const connection = require('../src/database/connection');
const generateUniqueId = require('../src/utils/generateUniqueId');

module.exports = async () => {
  const id = generateUniqueId();

  const firstTeam = {
    name: 'test-team1',
    established_in: 1899,
    league: 'testing league1',
    division: 'testing division',
    logo: 'some logo',
    number_of_titles: 1,
  };

  const {
    name,
    established_in,
    league,
    division,
    logo,
    number_of_titles,
  } = firstTeam;

  await connection('team').insert({
    id,
    name,
    established_in,
    league,
    division,
    logo,
    number_of_titles,
  });

  const createdTeam = await connection('team')
    .where('id', id)
    .select('*')
    .first();

  return createdTeam;
};
