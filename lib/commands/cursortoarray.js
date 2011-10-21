pronto = require('pronto');
function CursorToArray(){}
pronto.inheritsCommand(CursorToArray);
module.exports = CursorToArray;

/**
 * Get all of the Cursor data as an array.
 *
 * PARAMS
 * 
 * - cursor: The Cursor object. (REQUIRED)
 */
CursorToArray.prototype.execute = function (cxt, params) {
  this.required(params, ['cursor']);
  
  var cursor = params.cursor;
  var cmd = this;
  cursor.toArray(function (e, allData) {
    if (e) {
      cmd.error(e);
      return;
    }
    cmd.done(allData);
  });
}