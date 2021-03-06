var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');
var UseMongo = require('../lib/commands/use');
var CloseMongo = require('../lib/commands/close');
var GetMongoCollection = require('../lib/commands/getcollection');

// For testing:
//var mongodb = require('mongodb');

var cxt = new pronto.Context();
var register = new pronto.Registry();

register

.request('test')
  .does(UseMongo, 'connection').using('dbName', 'prontoTest')
  .does(GetMongoCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
  .does(common.TriremeClosureCommand, 'tests').using('fn', function(cxt, params, emitter) {
    assert.equal(cxt.get('narf').collectionName, 'narf', "Collection name should be 'narf'");
    emitter.done();
  })
  .does(CloseMongo, 'destroy')
    .using('dbName', 'prontoTest')
;


var router = new pronto.Router(register, cxt);

try {
  router.handleRequest('test');
}
catch (err) {
  console.log('Caught an unexpected err.');
  console.log(err);
}


router.on('error', function(e) {
  console.log('Main router error.')
  //console.log(cxt);
  //commandListRan = true;
})