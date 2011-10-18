pronto = require('pronto');
function MongoFind(){}
pronto.inheritsCommand(MongoFind);
module.exports = MongoFind;

/**
 * Prepare a query.
 *
 * This wraps a find query, configuring the cursor and returning it.
 * 
 * Params:
 *
 * - collection: The collection to query. REQUIRED.
 * - filter: The actual query filter to apply. Anything records that match 
 *   will be returned. If no filter is specified, all records in the collection
 *   are considered matches.
 * - fields: An object representing fields to be returned, i.e. 
 *   `{name: true, phone:true}`. The relationship can be inverted. The filter 
 *   `{name: false}` returns all fields EXCEPT name.
 * - skip: Skip over the first N in the result set (viz. offset).
 * - limit: Limit to N results at a time. 
 * - sort: Object representing what to sort on, and in what order. `{name:1}`
 *   sorts by name, ascending. (`-1` for descending.)
 *
 * @link http://www.mongodb.org/display/DOCS/Querying
 */
MongoFind.prototype.execute = function (cxt, params) {
  this.required(params, ['collection']);
  
  var collection = params.collection;
  var filter = params.filter || {};
  var fields = params.fields || {};
  var skip = params.skip;
  var limit = params.limit;
  var sort = params.sort;
  
  // What about explain() and count()?
  //var explain = params.explain;
  
  
  var cursor = collection.find(filter, fields);
  if (skip != undefined) {
    cursor.skip(skip);
  }
  if (limit != undefined) {
    cursor.limit(limit);
  }
  if (sort != undefined) {
    cursor.sort(sort);
  }
  
  this.done(cursor);
}