exports.up = function (knex) {
  return knex.schema.alterTable('game', (table) => {
    table.integer('pennant_id');
    table.foreign('pennant_id').references('id').inTable('pennant');
  });
};

exports.down = function (knex) {
  return knex.schema.table('game', (table) => {
    table.dropColumn('pennant_id');
  });
};
