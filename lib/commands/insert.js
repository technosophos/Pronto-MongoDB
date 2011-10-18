pronto = require('pronto');
function MongoInsert(){}
pronto.inheritsCommand(MongoInsert);
module.exports = MongoInsert;

/**
 * Insert a document or an array of documents into Mongo.
 * 
 * Params:
 * - collection: the collection to modify. This should be a MongoDB.Collection object. (REQUIRED)
 * - data: An array of documents or a single document. A document is any JSON-serializable object. (REQUIRED)
 * - options: Any options to pass through. (OPTIONAL) e.g. {safe: true}.
 */
MongoInsert.prototype.execute = function(cxt, params) {
  this.required(params, ['collection', 'data']);
  
  var collection = params.collection;
  var data = params.data;
  var options = {};
  
  var cmd = this;
  collection.insert(data, options, function (err, result) {
    if (err) {
      cmd.emit('error', err);
      return;
    }
    cmd.done(result);
  });
}