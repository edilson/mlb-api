exports.up = function (knex) {
  return knex.schema.alterTable('world_series', (table) => {
    table.dropUnique('champion_id');
    table.dropUnique('runners_up_id');
  });
};

exports.down = function () {};
