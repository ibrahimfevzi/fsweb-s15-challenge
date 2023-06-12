exports.up = function (knex) {
  return knex.schema.createTable('users', users => {
    users.increments();
    users.string('username', 255).notNullable().unique();
    users.string('password', 255).notNullable();
  })
  .createTable("tokenBlackList",t=>{
    t.increments(),
    t.string("token").notNullable()
    t.timestamp("createdate").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
        .dropTableIfExists("tokenBlackList");
};
