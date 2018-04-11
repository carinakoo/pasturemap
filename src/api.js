const { transaction } = require('objection');
const Animal = require('./db/models/Animal');
const _ = require('lodash')
const moment = require('moment');

module.exports = router => {
  // add animal
  router.post('/animal', async (req, res) => {
    const { body } = req
    if (!body.id) res.sendStatus(400);
    const animal = await Animal
      .query()
      .findOne(body)
    if (!animal) {
      const animal = await Animal
        .query()
        .insert(body)
        .returning('*')
      res.send(animal)
    }
    res.send(animal)
  });

  // add weight
  router.post('/animal/:id/weight', async (req, res) => {
    const animal = await Animal.query().findById(req.params.id);

    if (!animal) {
      throw createStatusCodeError(404);
    }

    const weight_record = await animal
      .$relatedQuery('weights')
      .insert(req.body)

    res.send(weight_record);
  });

  // get list of animals with weights
  router.get('/animal', async (req, res) => {
    const animals = await Animal.query()
      .eager('weights')
    res.json(animals)
  });

  // get total estimated weight
  router.get('/animal/estimated_weight', async (req, res) => {
    const { query: { date } } = req
    const animals = await Animal.query()
      .eager('weights')

    // TODO: handle edge case for missing weight data
    const weights = animals.map(getInterpolatedWeight(date))
    const sum = _.sum(weights)
    res.json({
      'num_animals': weights.length,
      'estimated_total_weight': sum
    })
  });
}

// calculated interpolated weight for one animal
const getInterpolatedWeight = date => animal => {
  const { weights } = animal
  if (weights.length === 0) return 0
  if (weights.length === 10) return weights[0].weight

  const sortedWeights = _.sortBy(weights, 'weigh_date')
  const dateObj = { weigh_date: date }
  const sortedIndex = _.sortedIndexBy(sortedWeights, dateObj, 'weigh_date')

  let x1, y1, x2, y2
  const len = sortedWeights.length
  if (sortedIndex === 0) {
    x1 = sortedWeights[0].weigh_date
    y1 = sortedWeights[0].weight
    x2 = sortedWeights[1].weigh_date
    y2 = sortedWeights[1].weight
  } else if (sortedIndex === sortedWeights.length) {
    x1 = sortedWeights[len - 2].weigh_date
    y1 = sortedWeights[len - 2].weight
    x2 = sortedWeights[len - 1].weigh_date
    y2 = sortedWeights[len - 1].weight
  } else {
    x1 = sortedWeights[sortedIndex - 1].weigh_date
    y1 = sortedWeights[sortedIndex - 1].weight
    x2 = sortedWeights[sortedIndex].weigh_date
    y2 = sortedWeights[sortedIndex].weight
  }
  const x1x2Diff = moment(x2).diff(moment(x1), 'days')
  const y1y2Diff = y2 - y1
  const xx1Diff = moment(date).diff(moment(x1), 'days')
  const res = y1 + (xx1Diff * (y1y2Diff / x1x2Diff))
  return res
}

// The error returned by this function is handled in the error handler middleware in app.js.
function createStatusCodeError(statusCode) {
  return Object.assign(new Error(), {
    statusCode
  });
}