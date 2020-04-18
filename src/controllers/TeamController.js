const connection = require('../database/connection');
const generateUniqueId = require('../utils/generateUniqueId');

const TEAM_TABLE = 'team';
const LIMIT_PER_PAGE = 10;

module.exports = {
  async create(request, response) {
    const {
      name,
      established_in,
      league,
      division,
      logo,
      number_of_titles,
    } = request.body;

    const id = generateUniqueId();

    await connection(TEAM_TABLE).insert({
      id,
      name,
      established_in,
      league,
      division,
      logo,
      number_of_titles,
    });

    return response
      .status(201)
      .json({ name, established_in, league, division, logo, number_of_titles });
  },
  async list(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection(TEAM_TABLE).count();

    const teams = await connection(TEAM_TABLE)
      .select(['id', 'name', 'logo'])
      .limit(LIMIT_PER_PAGE)
      .offset((page - 1) * LIMIT_PER_PAGE);

    response.header('X-Total-Count', count['count']);

    return response.json(teams);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection(TEAM_TABLE).where('id', id).update(request.body);

    const updated_team = await connection(TEAM_TABLE)
      .where('id', id)
      .select('*')
      .first();

    return response.json(updated_team);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection(TEAM_TABLE).where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const team = await connection(TEAM_TABLE)
      .where('id', id)
      .select('*')
      .first();

    team.venue = await connection('venue')
      .where('team_id', team.id)
      .select(['id', 'name'])
      .first();

    return response.json(team);
  },
};
