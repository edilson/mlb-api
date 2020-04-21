exports.up = function (knex) {
  return knex.schema.createTable('world_series', (table) => {
    table.increments();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();

    table.string('champion_id').notNullable().unique();
    table.foreign('champion_id').references('id').inTable('team');

    table.string('runners_up_id').notNullable().unique();
    table.foreign('runners_up_id').references('id').inTable('team');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('world_series');
};
