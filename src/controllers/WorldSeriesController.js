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

    const worldSeries = await connection(WORLD_SERIES_TABLE)
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE)
      .select('*');

    response.header('X-Total-Count', count['count']);

    return response.json(worldSeries);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(WORLD_SERIES_TABLE).where('id', id).update(request.body);

    const worldSeriesUpdated = await connection(WORLD_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(worldSeriesUpdated);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(WORLD_SERIES_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const worldSeries = await connection(WORLD_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    worldSeries.champion = await connection('team')
      .where('id', worldSeries.champion_id)
      .select('*')
      .first();

    worldSeries.games = await connection('game')
      .where('world_series_id', worldSeries.id)
      .select('*');

    return response.json(worldSeries);
  },
};
