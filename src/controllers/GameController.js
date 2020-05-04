const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const {
      event_date,
      venue_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
    } = request.body;

    const { world_series_id, pennant_id } = request.params;

    await connection('game').insert({
      event_date,
      venue_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
      world_series_id,
      pennant_id,
    });

    return response.status(201).json({
      event_date,
      venue_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
      world_series_id,
      pennant_id,
    });
  },
  async list(request, response) {
    const { world_series_id } = request.params;

    const [count] = await connection('game')
      .where('world_series_id', world_series_id)
      .count();

    const games = await connection('game')
      .where('world_series_id', world_series_id)
      .select('*');

    response.header('X-Total-Count', count['count']);

    return response.json(games);
  },
  async update(request, response) {
    const { world_series_id, game_id } = request.params;

    await connection('game')
      .where({ world_series_id: world_series_id, id: game_id })
      .update(request.body);

    const updatedGame = await connection('game')
      .where({
        world_series_id: world_series_id,
        id: game_id,
      })
      .select('*')
      .first();

    return response.json(updatedGame);
  },
  async delete(request, response) {
    const { world_series_id, game_id } = request.params;

    await connection('game')
      .where({
        world_series_id: world_series_id,
        id: game_id,
      })
      .delete();

    return response.status(204).send();
  },
  async findById(request, response) {
    const { world_series_id, game_id } = request.params;

    const game = await connection('game')
      .where({
        world_series_id: world_series_id,
        id: game_id,
      })
      .select('*')
      .first();

    return response.json(game);
  },
};
