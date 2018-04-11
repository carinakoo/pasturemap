'use strict';

/**
 * This file contains a bunch of HTTP requests that use the
 * API defined in api.js.
 */

const axios = require('axios');

const req = axios.create({
  baseURL: 'http://localhost:3000/'
});

(async () => {
  ////////////////////////////////////////////////
  // Insert some people
  ////////////////////////////////////////////////

  let animal = await req.post('animal', {
    id: 100,
  });

  console.log('inserted', animal.data);

  let weight1 = await req.post('animal/100/weight', {
    "weight": 452.5,
    "weigh_date": "2018-03-01T12:00:00Z"
  });
  console.log('inserted', weight1.data);

  let weight2 = await req.post('animal/100/weight', {
    "weight": 470.5,
    "weigh_date": "2018-03-05T12:00:00Z"
  });
  console.log('inserted', weight2.data);

  ////////////////////////////////////////////////
  // Fetch Persons
  ////////////////////////////////////////////////

  let animals = await req.get('animal');

  console.dir(animals.data, { depth: null });

  let totalWeight = await req.get('/animal/estimated_weight?date=2018-03-03T12:00:00Z')
  console.log('total Weight ', totalWeight.data);

})().catch(err => {
  console.error(err.response.data);
});
