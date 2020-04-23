const connection = require('../src/database/connection');

module.exports = async (venue_owner_id) => {
  const firstVenue = {
    name: 'awesome stadium',
    opened: new Date(1955, 8 - 1, 12),
    capacity: 39590,
    location: 'some awesome',
    team_id: venue_owner_id,
  };

  const { name, opened, capacity, location, team_id } = firstVenue;

  await connection('venue').insert({
    name,
    opened,
    capacity,
    location,
    team_id,
  });

  const createdVenue = await connection('venue')
    .where('id', venue_owner_id)
    .select('*')
    .first();

  return createdVenue;
};
