const connection = require('../database/connection');

const WORLD_SERIES_TABLE = 'world_series';
const LIMIT_PER_PAGE = 20;

module.exports = {
  async create(request, response) {
    let { start_date, end_date, champion_id, runners_up_id } = request.body;

    await connection(WORLD_SERIES_TABLE).insert({
      start_date,
      end_date,
      champion_id,
      runners_up_id,
    });

    return response
      .status(201)
      .json({ start_date, end_date, champion_id, runners_up_id });
  },
  async list(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection(WORLD_SERIES_TABLE).count();

    const world_series = await connection(WORLD_SERIES_TABLE)
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE)
      .select('*');

    response.header('X-Total-Count', count['count']);

    return response.json(world_series);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(WORLD_SERIES_TABLE).where('id', id).update(request.body);

    const worldSeriesToUpdate = await connection(WORLD_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    if (worldSeriesToUpdate.start_date > worldSeriesToUpdate.end_date) {
      return response
        .status(400)
        .json({ message: 'end_date must be higher than start_date' });
    }

    return response.json(worldSeriesToUpdate);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(WORLD_SERIES_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const world_series = await connection(WORLD_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(world_series);
  },
};
