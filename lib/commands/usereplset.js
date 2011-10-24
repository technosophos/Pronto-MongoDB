var pronto = require('pronto');
var mongo = require('mongodb');

module.exports = UseReplSet;

function UseReplSet() {
  
}
pronto.inheritsCommand(UseReplSet);


/**
 * Connect to a replica set.
 *
 * This connects to an entire replica set of MongoDB servers. It will
 * attempt to pick the master, and direct write operations to the master,
 * while reads will be distributed unless the 'readSecondery' parameter is
 * passed in with a false value.
 *
 * PARAMS
 * - dbName: The name of the mongodb replica set. This is used anywhere that DB Name is typically used (REQUIRED).
 * - servers: An array of objects, each of which MUST have 'host' and 'port', and MAY have 'options'. (REQUIRED)
 * - serverOpts: Options that will be assigned to any host that doesn't have its own options defined. See 'servers'
 * - readSecondary: If set to `false`, then reads will be done only on the master. Otherwise, reads are balanced
 *   over the cluster.
 * - rsName: Explicitly set the name of the replica set to be used.
 *
 */
UseReplSet.prototype.execute = function (cxt, params) {
  this.required(params, ['servers', 'dbName']);
  
  // Get all params
  var dbName = params.dbName;
  var servers = params.servers;
  var options = params.serverOpts || {};
  var readSecondary = params.readSecondary != undefined ? !! params.readSecondary : true;
  var rsName = params.rsName;
  
  // Put server definitions into an array.
  var servers = [];
  for (var i = 0; i < servers.length; ++i) {
    var server_opts = servers[i].options || options;
    var server = new mongo.Server(servers[i].host, servers[i].port, server_opts);
    servers.push(server);
  }
  
  // Configure the params for the ReplSetServers
  var dbParams = {
    'read_secondary': readSecondary
  };
  if (rsName != undefined) {
    dbParams.rs_name = rsName;
  }
  
  // Create the Repl-backed and connect to it.
  var rset = new mongo.ReplSetServers(servers, dbParams);
  var db = new mongo.Db(dbName, rset);
  var cmd = this;
  db.open(function (err, d) {
    console.log('Opening')
    if (err instanceof Error) {
      //console.log(err)
      cxt.log(err.stack, 'error');
      cmd.emit('error', err);
      return;
    }
    
    cxt.addDatasource(dbName, d);
    cmd.done(dbName);
  });
}