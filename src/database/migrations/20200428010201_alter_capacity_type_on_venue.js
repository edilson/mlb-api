exports.up = function (knex) {
  return knex.schema.alterTable('venue', (table) => {
    table.integer('capacity').notNullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.table('venue', (table) => {
    table.integer('capacity').notNullable().alter();
  });
};
