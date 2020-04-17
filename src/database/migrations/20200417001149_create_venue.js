exports.up = function (knex) {
  return knex.schema.createTable('venue', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.date('opened').notNullable();
    table.decimal('capacity', 6, 3).notNullable();
    table.string('location').notNullable();

    table.string('team_id').notNullable().unique();
    table.foreign('team_id').references('id').inTable('team');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('venue');
};
