pronto = require('pronto');

function CreateCollection(){}
pronto.inheritsCommand(CreateCollection);
module.exports = CreateCollection;

/**
 * Create a new collection.
 *
 * Most of the time, MongoDB can do this for you. Sometimes, however, 
 * you may need to create a collection manually (a capped collection 
 * is a good example). You can use this to create a collection and pass in
 * specifications.
 *
 * PARAMS
 * - dbName: The name of the DB handle to use. (REQUIRED)
 * - collection: The name of the collection to create. (REQUIRED)
 * - options: The options to pass in to the creation function. Example: {capped: true, max: 5 size: 2048}
 *
 * When this is successful, it puts the collection in the context, as GetCollection does.
 */
CreateCollection.prototype.execute = function (cxt, params) {
  this.required(params, ['collection', 'dbName']);
  
  var dbName = params.dbName
  var name = params.collection;
  var opts = params.options || {};

  var db = cxt.getDatasource(dbName);
  var cmd = this;
  db.createCollection(name, opts, function (err, collection) {
    
    if (err) {
      cmd.error(err);
      return;
    }
    
    //cxt.addDatasource(name, collection);
    cmd.done(collection);
  });
  
}