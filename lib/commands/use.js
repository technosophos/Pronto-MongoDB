var utl = require('util');
var pronto = require('pronto');
var mongo = require('mongodb');

module.exports = UseMongo;

function UseMongo() {
  
}
pronto.inheritsCommand(UseMongo);

/**
 * Connect to a named Mongo DB.
 *
 * Params:
 * - host: The hostname of the server, defaults to localhost
 * - port: The port upon which MongoDB listens; defaults to 27017
 * - serverOpts: an object containing server options, as defined in the MongoDB package.
 *    - auto_reconnect: Reconnect when a connection dies (false)
 *    - poolSize: The max number of connections in the pool (1)
 * - dbName: The name of the database. REQUIRED.
 * - dbOpts: MongoDB options, as defined in the MongoDB package.
 * - poolSize: Overrides serverOpts[poolSize].
 * - autoReconnect: Overrides serverOpts[auto_reconnect]
 */
UseMongo.prototype.execute = function(cxt, params) {
  
  this.required(params, ['dbName']);
  
  var host = params.host || 'localhost';
  var port = params.port || 27017;
  var serverOpts = params.serverOpts || {};
  var dbName = params.dbName || null;
  var dbOpts = params.dbOpts || {};
  
  if (params.poolSize) {
    serverOpts['poolSize'] = params.poolSize;
  }
  if (params.autoReconnect) {
    serverOpts['auto_reconnect'] = params.autoReconnect;
  }
  
  if (dbName == null || dbName.length == 0) {
    this.emit('error', new Error('The dbName parameter is required.'));
    return;
  }

  var server = new mongo.Server(host, port, serverOpts);
  var mongodb = new mongo.Db(dbName, server, dbOpts);
  
  //this.on('error', function(e) {console.log(e)});
  
  var cmd = this;
  mongodb.open(function (err, db) {
    if (err != null) {
      //console.log(err)
      cxt.log(err.stack, 'error');
      //cmd.emit('error', err);
      return;
    }
    cxt.addDatasource(dbName, db);
    
    var cn = dbName + ' at ' + host + ':' + port;
    cxt.log('Opened MongoDB connection to ' + cn, 'info');
    cmd.done(dbName);
  });
}