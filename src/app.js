/*
 *
 * PastureMap Full Stack Code Challenge
 *
 */

const _ = require('lodash');
const Knex = require('knex');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const promiseRouter = require('express-promise-router');
const knexConfig = require('../knexfile');
const registerApi = require('./api');
const { Model } = require('objection');


// Initialize knex.
const knex = Knex(knexConfig);

Model.knex(knex);

const router = promiseRouter();
const app = express()
  .use(bodyParser.json())
  .use(router)
  .set('json spaces', 2);

// Register our REST API.
registerApi(router);

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

module.exports = app;
