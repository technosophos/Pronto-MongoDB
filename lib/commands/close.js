var mongo = require('mongodb');
var pronto = require('pronto');

module.exports = CloseMongo;
function CloseMongo() {}
pronto.inheritsCommand(CloseMongo);

CloseMongo.prototype.execute = function(cxt, params) {
	var dbName = params.dbName || 'mongodb';
	
	var db = cxt.getDatasource(dbName);
	db.close();
	cxt.log('Closed MongoDB connection to ' + dbName, 'info');
	this.done(dbName);
}