const connection = require('../database/connection');

const VENUE_TABLE = 'venue';
const LIMIT_PER_PAGE = 10;

module.exports = {
  async create(request, response) {
    const { name, opened, capacity, location, team_id } = request.body;

    await connection(VENUE_TABLE).insert({
      name,
      opened,
      capacity,
      location,
      team_id,
    });

    return response.status(201).json({
      name,
      opened,
      capacity,
      location,
      team_id,
    });
  },
  async list(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection(VENUE_TABLE).count();

    const venues = await connection(VENUE_TABLE)
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE)
      .select(['venue.id', 'venue.name', 'venue.location']);

    response.header('X-Total-Count', count['count']);

    return response.json(venues);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(VENUE_TABLE).where('id', id).update(request.body);

    const updated_venue = await connection(VENUE_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(updated_venue);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(VENUE_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const venue = await connection(VENUE_TABLE)
      .where('id', id)
      .select('*')
      .first();

    venue.team = await connection('team')
      .where('id', venue.team_id)
      .select('id', 'name', 'logo')
      .first();

    return response.json(venue);
  },
};