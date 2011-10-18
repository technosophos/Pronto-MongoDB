pronto = require('pronto');
function DropMongoCollection(){}
pronto.inheritsCommand(DropMongoCollection);
module.exports = DropMongoCollection;

/**
 * Delete a collection from a Mongo database.
 * 
 * - dbName: Name of the DB. REQUIRED. You must also have opened the DB.
 * - collection: Name of the collection. REQUIRED.
 */
DropMongoCollection.prototype.execute = function (cxt, params) {
  this.required(params, ['dbName', 'collection']);
  
  var dbName = params.dbName;
  var collectionName = params.collection;
  var db = cxt.getDatasource(dbName);
  
  var cmd = this;
  db.dropCollection(collectionName, function (err, ok) {
    if (err) {
      // This is not really a fatal error. It's
      // a predicable event.
      if (/ns not found/(err.message)) {
        cmd.done(false);
        return;
      }
      else {
        throw err;
      }
      return;
    }
    cmd.done(ok);
  });
  
}