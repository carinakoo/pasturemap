const { Model } = require('objection')
const Animal = require('./Animal')

class Weight extends Model {
  static get tableName() {
    return 'weights';
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      animal: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: __dirname + '/Animal',
        // modelClass: Animal,
        join: {
          from: 'weights.animal_id',
          to: 'animals.id'
        }
      }
    };
  }
}

module.exports = Weight