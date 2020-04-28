const connection = require('../src/database/connection');
const generateUniqueId = require('../src/utils/generateUniqueId');

module.exports = async (
  teamName,
  foundationYear,
  teamLeague,
  teamDivision,
  teamLogo,
  teamNumberOfTitles
) => {
  const id = generateUniqueId();

  const firstTeam = {
    name: teamName,
    established_in: foundationYear,
    league: teamLeague,
    division: teamDivision,
    logo: teamLogo,
    number_of_titles: teamNumberOfTitles,
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
