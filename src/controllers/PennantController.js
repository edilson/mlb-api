const connection = require('../database/connection');

const PENNANT_TABLE = 'pennant';
const LIMIT_PER_PAGE = 20;

module.exports = {
  async create(request, response) {
    let { start_date, end_date, champion_id, runners_up_id } = request.body;

    await connection(PENNANT_TABLE).insert({
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

    const [count] = await connection(PENNANT_TABLE).count();

    const pennants = await connection(PENNANT_TABLE)
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE)
      .select('*');

    response.header('X-Total-Count', count['count']);

    return response.json(pennants);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(PENNANT_TABLE).where('id', id).update(request.body);

    const pennantUpdated = await connection(PENNANT_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(pennantUpdated);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(PENNANT_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const pennant = await connection(PENNANT_TABLE)
      .where('id', id)
      .select('*')
      .first();

    pennant.champion = await connection('team')
      .where('id', pennant.champion_id)
      .select('*')
      .first();

    return response.json(pennant);
  },
};
