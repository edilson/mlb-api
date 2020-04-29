const connection = require('../database/connection');

const DIVISION_SERIES_TABLE = 'division_series';
const LIMIT_PER_PAGE = 20;

module.exports = {
  async create(request, response) {
    const { start_date, end_date, champion_id, record } = request.body;

    await connection(DIVISION_SERIES_TABLE).insert({
      start_date,
      end_date,
      champion_id,
      record,
    });

    return response
      .status(201)
      .json({ start_date, end_date, champion_id, record });
  },
  async list(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection(DIVISION_SERIES_TABLE).count();

    const divisionSeries = await connection(DIVISION_SERIES_TABLE)
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE)
      .select('*');

    response.header('X-Total-Count', count['count']);

    return response.json(divisionSeries);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(DIVISION_SERIES_TABLE)
      .where('id', id)
      .update(request.body);

    const divisionSeriesToUpdate = await connection(DIVISION_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    if (divisionSeriesToUpdate.start_date > divisionSeriesToUpdate.end_date) {
      return response
        .status(400)
        .json({ message: 'end_date must be higher than start_date' });
    }

    return response.json(divisionSeriesToUpdate);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(DIVISION_SERIES_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const divisionSeries = await connection(DIVISION_SERIES_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(divisionSeries);
  },
};
