pronto = require('pronto');

function DropIndexes(){}
pronto.inheritsCommand(DropIndexes);
module.exports = DropIndexes;

/**
 * Drop all indexes (indices) on a collection.
 *
 * This will drop all of the indexes on a given collection.
 *
 * Params
 * - collection: The collection. (REQUIRED)
 */
DropIndexes.prototype.execute = function (cxt, params) {
  this.required(params, ['collection']);
  
  var collection = params.collection
  
  var cmd = this;
  collection.dropIndexes(function (err, data) {
    if (err) {
      this.error(err);
      return;
    }
    cmd.done(data); // Data should be 'true'
  });
}