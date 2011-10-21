var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');

var Use = require('../lib/commands/use');
var Close = require('../lib/commands/close');
var GetCollection = require('../lib/commands/getcollection');
var Drop = require('../lib/commands/dropcollection');
var Insert = require('../lib/commands/insert');
var Save = require('../lib/commands/save');
var Find = require('../lib/commands/find');
var CursorToArray  = require('../lib/commands/cursortoarray');

var docs = [
  {'doc': 1, 'sammich': 'pbj'},
  {'doc': 2, 'sammich': 'pbj'},
  {'doc': 3, 'sammich': 'pbj'},
  {'doc': 4, 'sammich': 'avacado'},
  {'doc': 5, 'sammich': 'turkey'},
  {'doc': 6, 'sammich': 'blt'}
];

reg = common.canHazReg()
  .route('test')
    .does(Use, 'use').using('dbName', 'prontoTest')
    .does(GetCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
    
    // But in a few docs
    .does(Insert, 'doc1').using('collection').from('cxt:narf').using('data', docs)

    // Test PBJ
    .does(Find, 'pbjs').using('collection').from('cxt:narf')
      .using('filter', {'sammich': 'pbj'})
      .using('sort', {'doc': 1})
    .does(common.TriremeClosureCommand, 'test')
      .using('fn', function (cxt, params, cb) {
        var pbjs = cxt.get('pbjs');
        
        // Test count on collection.
        pbjs.count(function (e, c) {
          assert.equal(3, c);
          
        })
        
        // Test toArray on collection.
        pbjs.toArray(function (e, data) {
          assert.equal(data.length, 3);
          assert.equal(data[0].doc, 1);
          cb.done();
        });
        
        //cb.done();
      })
    
    // Test other find options.
    .does(Find, 'all').using('collection').from('cxt:narf')
      .using('fields', {'sammich': true})
      .using('sort', {'sammich': 1})
      .using('skip', 1) // Skip avacado
      .using('limit', 4) // Cut off turkey
    .does(CursorToArray, 'array')
      .using('cursor').from('cxt:all')
    .does(common.TriremeClosureCommand, 'test2').using('fn', function (cxt, params, cb) {
      
      var arr = cxt.get('array');
      assert.equal(arr.length, 4);
      assert.equal(arr[0].sammich, 'blt');
      assert.equal(arr[3].sammich, 'pbj');
      assert.ok(arr[0]['doc'] == undefined);
      cb.done('Yodel like you mean it.');
      
      /*
      var cursor = cxt.get('all');
      
      cursor.toArray(function (e, arr) {
        assert.equal(arr.length, 4);
        assert.equal(arr[0].sammich, 'blt');
        assert.equal(arr[3].sammich, 'pbj');
        assert.ok(arr[0]['doc'] == undefined);
        
        cb.done('Yodel like you mean it.');
      });
      */
    })
    .does(Drop).using('collection', 'narf').using('dbName', 'prontoTest')
    .does(Close).using('dbName', 'prontoTest')
  .route('reset')
    .does(Use, 'use').using('dbName', 'prontoTest')
    .does(Drop).using('collection', 'narf').using('dbName', 'prontoTest')
    .does(Close).using('dbName', 'prontoTest')
;

common.runPlz('reset', reg);
common.runPlz('test', reg);