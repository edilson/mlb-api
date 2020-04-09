const crypto = require('crypto');

const connection = require('../database/connection');

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

    const id = crypto.randomBytes(4).toString('HEX');

    await connection('team').insert({
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

    const [count] = await connection('team').count();

    const teams = await connection('team')
      .select(['id', 'name', 'logo'])
      .limit(10)
      .offset((page - 1) * 10);

    response.header('X-Total-Count', count['count']);

    return response.json(teams);
  },
  async update(request, response) {
    const { id } = request.params;

    await connection('team').where('id', id).update(request.body);

    const updated_team = await connection('team')
      .where('id', id)
      .select('*')
      .first();

    return response.json(updated_team);
  },
  async delete(request, response) {
    const { id } = request.params;

    await connection('team').where('id', id).delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { id } = request.params;

    const team = await connection('team').where('id', id).select('*').first();

    return response.json(team);
  },
};
