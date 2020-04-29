const connection = require('../../src/database/connection');

module.exports = async (
  venueName,
  openedDate,
  venueCapacity,
  venueLocation,
  venueOwnerId
) => {
  const venue = {
    name: venueName,
    opened: openedDate,
    capacity: venueCapacity,
    location: venueLocation,
    team_id: venueOwnerId,
  };

  const { name, opened, capacity, location, team_id } = venue;

  await connection('venue').insert({
    name,
    opened,
    capacity,
    location,
    team_id,
  });

  const createdVenue = await connection('venue')
    .where('team_id', venueOwnerId)
    .select('*')
    .first();

  return createdVenue;
};
