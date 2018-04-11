const app = require('./app');

// Sets server port and logs message on success
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('app listening at port %s', server.address().port);
});