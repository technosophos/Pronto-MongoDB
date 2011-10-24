pronto = require('pronto');

function DropIndex(){}
pronto.inheritsCommand(DropIndex);
module.exports = DropIndex;

/**
 * Drop a named index.
 *
 * This will drop the named index.
 *
 * Params
 * - collection: The collection. (REQUIRED)
 * - index: The name of the index to drop. (REQUIRED)
 */
DropIndex.prototype.execute = function (cxt, params) {
  this.required(params, ['collection', 'index']);
  
  var name = params.index;
  var collection = params.collection
  
  var cmd = this;
  collection.dropIndex(name, function (err, data) {
    if (err) {
      this.error(err);
      return;
    }
    cmd.done(data); // Data should be 'true'
  });
}