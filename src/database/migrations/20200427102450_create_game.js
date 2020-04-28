exports.up = function (knex) {
  return knex.schema.createTable('game', (table) => {
    table.increments();
    table.date('event_date').notNullable();

    table.integer('venue_id').notNullable();
    table.foreign('venue_id').references('id').inTable('venue');

    table.string('winner_id').notNullable();
    table.foreign('winner_id').references('id').inTable('team');

    table.string('loser_id').notNullable();
    table.foreign('loser_id').references('id').inTable('team');

    table.integer('winner_score').notNullable();
    table.integer('loser_score').notNullable();

    table.integer('world_series_id');
    table.foreign('world_series_id').references('id').inTable('world_series');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('game');
};
