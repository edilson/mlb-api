exports.up = function (knex) {
  return knex.schema.createTable('team', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.integer('established_in').notNullable();
    table.string('league').notNullable();
    table.string('division').notNullable();
    table.string('logo').notNullable();
    table.integer('number_of_titles').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('team');
};
