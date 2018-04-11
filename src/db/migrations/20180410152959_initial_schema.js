exports.up = function (knex, Promise) {
  return knex.schema.createTable('animals', function (table) {
    table.integer('id').notNullable().unique()
    table.index('id')
  }).createTable('weights', function (table) {
    table.increments('id')
    table.integer('animal_id').notNullable();
    table.float('weight').notNullable();
    table.dateTime('weigh_date').notNullable();
    table.index('animal_id')
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('animals');
  return knex.schema.dropTable('weights');
};