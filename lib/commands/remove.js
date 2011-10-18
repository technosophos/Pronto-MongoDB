pronto = require('pronto');
function MongoRemove(){}
pronto.inheritsCommand(MongoRemove);
module.exports = MongoRemove;

MongoRemove.prototype.execute = function (cxt, params) {
  this.required(params, ['collection']);
  
  var collection = params.collection;
  var filter = params.filter || {};
  var options = params.options || {};
  
  var cmd = this;
  collection.remove(filter, options, function (err, result) {
    if (err) {
      console.log(err.stack);
      cmd.emit('error', err);
    }
    cmd.done(result);
  });
}