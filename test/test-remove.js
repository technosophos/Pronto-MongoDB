var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');

var Use = require('../lib/commands/use');
var Close = require('../lib/commands/close');
var GetCollection = require('../lib/commands/getcollection');
var Drop = require('../lib/commands/dropcollection');
var Insert = require('../lib/commands/insert');
var Save = require('../lib/commands/save');
var FindOne = require('../lib/commands/findone');
var Remove = require('../lib/commands/remove');

reg = common.canHazReg()
.route('test')
  .does(Use, 'use').using('dbName', 'prontoTest')
  .does(GetCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
  .does(Insert, 'doc1').using('collection').from('cxt:narf').using('data', {'doc': 1})
  .does(Save, 'doc2').using('collection').from('cxt:narf').using('data', {'doc': 2})
  
  // Canary
  .does(FindOne, 'canary').using('collection').from('cxt:narf').using('filter', {'doc': 1})
  .does(common.TriremeClosureCommand)
  .using('fn', function (cxt, params, cb) {
    var looky = cxt.get('canary');
    assert.ok(looky);
    cb.done();
  })
  
  
  // Test removing one.
  .does(Remove, 'killDoc1')
   .using('collection').from('cxt:narf')
   .using('filter', {doc: 1})
  .does(FindOne, 'looky').using('collection').from('cxt:narf').using('filter', {'doc': 1})
  .does(common.TriremeClosureCommand)
  .using('fn', function (cxt, params, cb) {
    var looky = cxt.get('looky');
    assert.ok(looky == undefined)
    cb.done();
  })

  // Try removing them all.
  .does(Remove, 'killallDocs')
    .using('collection').from('cxt:narf')
    //.using('filter', {})
  .does(FindOne, 'getDoc2').using('collection').from('cxt:narf').using('filter', {'doc': 2})
  .does(common.TriremeClosureCommand)
   .using('fn', function (cxt, params, cb) {
     var looky = cxt.get('getDoc2');
     assert.ok(looky == undefined)
     cb.done();
   })
  
  //
  .does(Drop).using('collection', 'narf').using('dbName', 'prontoTest')
  .does(Close).using('dbName', 'prontoTest')
;

common.runPlz('test', reg);