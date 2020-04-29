exports.up = function (knex) {
  return knex.schema.createTable('division_series', (table) => {
    table.increments();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();

    table.string('champion_id').notNullable();
    table.foreign('champion_id').references('id').inTable('team');

    table.string('record').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('division_series');
};
