const connection = require('../database/connection');

module.exports = {
  async getVenue(request, response) {
    const { id } = request.params;

    const teamVenue = await connection('venue')
      .where('team_id', id)
      .select('*')
      .first();

    return response.json(teamVenue);
  },
  async listWorldSeries(request, response) {
    const { id } = request.params;

    const teamWorldSeries = await connection('world_series')
      .where('champion_id', id)
      .select('*');

    return response.json(teamWorldSeries);
  },
  async listDivisionSeries(request, response) {
    const { id } = request.params;

    const teamDivisionSeries = await connection('division_series')
      .where('champion_id', id)
      .select('*');

    return response.json(teamDivisionSeries);
  },
  async listPennants(request, response) {
    const { id } = request.params;

    const teamPennants = await connection('pennant')
      .where('champion_id', id)
      .select('*');

    return response.json(teamPennants);
  },
};
