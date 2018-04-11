module.exports = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './animals.db'
  },
  migrations: {
    directory: __dirname + '/src/db/migrations'
  },
};
