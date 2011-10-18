pronto = require('pronto');
function MongoUpdate(){}
pronto.inheritsCommand(MongoUpdate);
module.exports = MongoUpdate;

/**
 * Update an existing document.
 *
 * Note that your 'data' param will beed a valid change set operation.
 * http://www.mongodb.org/display/DOCS/Atomic+Operations
 * 
 * Params:
 * - collection: the collection to modify. This should be a MongoDB.Collection object. (REQUIRED)
 * - data: An array of documents or a single document. A document is any JSON-serializable object. (REQUIRED)
 * - filter: The filter to identify which documents you are updating.
 * - options: Any options to pass through. (OPTIONAL) e.g. {safe: true}.
 */
MongoUpdate.prototype.execute = function(cxt, params) {
  this.required(params, ['collection', 'data', 'filter']);
  
  var collection = params.collection;
  var filter = params.filter;
  var data = params.data;
  var options = {};
  
  var cmd = this;
  collection.update(filter, data, options, function (err, result) {
    if (err) {
      console.log(err.stack);
      cmd.emit('error', err);
      return;
    }
    cmd.done(result);
  });
}