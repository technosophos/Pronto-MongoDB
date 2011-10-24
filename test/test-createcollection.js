var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');

var Closure = require('pronto/lib/commands/Closure');
var Use = require('../lib/commands/use');
var Close = require('../lib/commands/close');
var CreateCollection = require('../lib/commands/createcollection');
var DropCollection = require('../lib/commands/dropcollection');
var Insert = require('../lib/commands/insert');
var Save = require('../lib/commands/save');
var Find = require('../lib/commands/find');

// For testing:
//var mongodb = require('mongodb');

var cxt = new pronto.Context();
var register = new pronto.Registry();

var data = [
  {doc: 1},
  {doc: 2},
  {doc: 3},
  {doc: 4}
];

register

.request('test')
  .does(Use, 'connection').using('dbName', 'prontoTest')
  
  // Create a capped collection.
  .does(CreateCollection, 'ccc')
    .using('dbName', 'prontoTest')
    .using('collection', 'ccc')
    .using('options', {capped: true, max: 4, size: 1024})
  
  .does(Insert, 'testDoc').using('data', data).using('collection').from('cxt:ccc')
  .does(Insert, 'testDoc2').using('data', {'doc': 5}).using('collection').from('cxt:ccc')
  
  .does(Find, 'results').using('filter', {}).using('collection').from('cxt:ccc')
  
  // Check to see if collection has been appropriately capped.
  .does(Closure, 'tests').using('fn', function(cxt, params, emitter) {
    
    var res = cxt.get('results');
    res.count(function (e, c) {
      assert.equal(4, c);
    })
    
    emitter.done();
  })
  
  
  .does(DropCollection, 'drop').using('dbName', 'prontoTest').using('collection', 'ccc')
  .does(Close, 'destroy')
    .using('dbName', 'prontoTest')
;


var router = new pronto.Router(register, cxt);
router.handleRequest('test');