/*!
 * Get a mongo collection.
 */
pronto = require('pronto');

function GetMongoCollection(){}
pronto.inheritsCommand(GetMongoCollection);
module.exports = GetMongoCollection;

/**
 * Retrieve a collection and put it into the context.
 *
 * Params:
 * - db: The name of the db datasource, which will be fetched from the context. REQUIRED.
 * - collection: The name of the collection to get. REQUIRED.
 * - options: Any options that should be passed into MongoDB.collection(). OPTIONAL.
 *   (`{safe:true}` is the only documented option.)
 */
GetMongoCollection.prototype.execute = function (cxt, params) {
  
  this.required(params, ['dbName', 'collection']);
  
  var dbName = params.dbName;
  var collectionName = params.collection;
  var options = params.options || {};
  
  var db = cxt.getDatasource(dbName);
  if (!db) {
    this.emit('error', new Error('No database found with the name ' + dbName));
    return;
  }
  
  var self = this;
  db.collection(collectionName, options, function(err, collection) {
    if (err instanceof Error) {
      self.emit('error', err);
      return;
    }
    self.done(collection);
  });
}