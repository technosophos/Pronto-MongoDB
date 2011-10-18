pronto = require('pronto');
function MongoFindOne(){}
pronto.inheritsCommand(MongoFindOne);
module.exports = MongoFindOne;

/**
 * Find at most one document that matches a query.
 *
 * Params:
 * - collection: The collection object to search. (REQUIRED)
 * - filter: An object.
 */
MongoFindOne.prototype.execute = function (cxt, params) {
  this.required(params, ['collection']);
  var collection = params.collection;
  var filter = params.filter || {};
  var cmd = this;
  collection.findOne(filter, function (err, item) {
    //console.log(item);
    if (err) {
      cmd.emit('error', err);
      return;
    }
    cmd.done(item);
  })
}