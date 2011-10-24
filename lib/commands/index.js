pronto = require('pronto');

function Index(){}
pronto.inheritsCommand(Index);
module.exports = Index;

/**
 * Create/ensure an index.
 *
 * Internally, this uses ensureIndex().
 *
 * Params
 *
 * - collection: The collection on which to create the index. (REQUIRED)
 * - field: The field or fields to index. Generally, this is a string of the name of the field
 *   upon which the index should be created. More elaborate (object and "tuple") versions can
 *   be constructed, though. (REQUIRED)
 * 
 * This puts the index information into the context.
 */
Index.prototype.execute = function (cxt, params) {
  var collection = params.collection;
  var field = params.field;
  
  var cmd = this;
  collection.ensureIndex(field, function (err, info) {
    if (err) {
      cmd.error(err);
      return;
    }
    
    cmd.done(info);
  });
}