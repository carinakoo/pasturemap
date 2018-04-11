const { Model } = require('objection')
const Weight = require('./Weight')

class Animal extends Model {
  static get tableName() {
    return 'animals';
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      weights: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Weight,
        join: {
          from: 'animals.id',
          to: 'weights.animal_id'
        }
      },
    }
  }
}

module.exports = Animal;