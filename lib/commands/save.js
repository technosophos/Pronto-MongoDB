pronto = require('pronto');
function MongoSave(){}
pronto.inheritsCommand(MongoSave);
module.exports = MongoSave;

/**
 * Save a document.
 *
 * This does an Insert if the doc is new, or an Update if the doc already exists
 * (e.g. has a valid _id).
 * 
 * Params:
 * - collection: the collection to modify. This should be a MongoDB.Collection object. (REQUIRED)
 * - data: An array of documents or a single document. A document is any JSON-serializable object. (REQUIRED)
 * - options: Any options to pass through. (OPTIONAL) e.g. {safe: true}.
 */
MongoSave.prototype.execute = function(cxt, params) {
  this.required(params, ['collection', 'data']);
  
  var collection = params.collection;
  var data = params.data;
  var options = {};
  
  var cmd = this;
  collection.save(data, options, function (err, result) {
    if (err) {
      cmd.emit('error', err);
      return;
    }
    cmd.done(result);
  });
}