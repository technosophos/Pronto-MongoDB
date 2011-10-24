var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');

var Closure = require('pronto/lib/commands/closure');
var Use = require('../lib/commands/use');
var Close = require('../lib/commands/close');
var GetCollection = require('../lib/commands/getcollection');
var Drop = require('../lib/commands/dropcollection');
var Insert = require('../lib/commands/insert');
var Index = require('../lib/commands/index');
var FindOne = require('../lib/commands/findone');
var DropIndexes = require('../lib/commands/dropindexes');
var DropIndex = require('../lib/commands/dropindex');


reg = common.canHazReg()
  .route('test')
    .does(Use, 'use').using('dbName', 'prontoTest')
    .does(GetCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
    .does(Insert, 'doc1').using('collection').from('cxt:narf').using('data', [{'doc': 1}, {'doc': 2}, {'doc': 3}])
    
    // Create index.
    .does(Index, 'doIndex')
      .using('collection').from('cxt:narf')
      .using('field', 'doc')
    
    // Make sure the index isn't corrup. This would throw an error if it was.
    .does(FindOne, 'looky').using('collection').from('cxt:narf').using('filter', {'doc': 1})
    
    // Check to make sure index was created.
    .does(Closure, 'test')
      .using('fn', function (cxt, params, cb) {
        
        var indexInfo = cxt.get('doIndex');
        
        assert.ok(indexInfo);
        assert.ok(indexInfo.length > 0);
        
        cb.done();
      })
      
    // Drop the index.
    .does(DropIndex, 'dropIndex')
      .using('collection').from('cxt:narf')
      .using('index').from('cxt:doIndex')
      
    .does(Drop).using('collection', 'narf').using('dbName', 'prontoTest')
    .does(Close).using('dbName', 'prontoTest')
;

common.runPlz('test', reg);