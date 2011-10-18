var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');
var UseMongo = require('../lib/commands/use');
var CloseMongo = require('../lib/commands/close');

// For testing:
var mongodb = require('mongodb');

var cxt = new pronto.Context();
var register = new pronto.Registry();

register

.request('test')
	.does(UseMongo, 'connection')
		.using('dbName', 'prontoTest')
		.using('serverOpts', {'poolSize': 5})
	.does(common.TriremeClosureCommand, 'tests')
		.using('fn', function(cxt, params, emitter) {
			var ds = cxt.getDatasource('prontoTest');
			assert.ok(ds);
			assert.equal(ds.databaseName, 'prontoTest', "Names should be the same.");
			//assert.equal(ds.state, 'connected', "The database should be connected");
			emitter.done();
		})
	.does(CloseMongo, 'destroy')
		.using('dbName', 'prontoTest')
;


var router = new pronto.Router(register, cxt);

router.handleRequest('test');

router.on('commandListComplete', function(cxt) {
	//console.log(cxt);
	//commandListRan = true;
})