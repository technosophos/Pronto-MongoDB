var common = require('./common');
var assert = require('assert');
var pronto = require('pronto');

var Use = require('../lib/commands/use');
var Close = require('../lib/commands/close');
var GetCollection = require('../lib/commands/getcollection');
var Drop = require('../lib/commands/dropcollection');
var Insert = require('../lib/commands/insert');
var Update = require('../lib/commands/update');
var FindOne = require('../lib/commands/findone');

reg = common.canHazReg()
  .route('test')
    .does(Use, 'use').using('dbName', 'prontoTest')
    .does(GetCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
    .does(Insert, 'doc1').using('collection').from('cxt:narf').using('data', {'doc': 1})
    
    // Update the record.
    .does(Update, 'update1')
      .using('collection').from('cxt:narf')
      .using('filter', {doc: 1})
      .using('data', {'$set': {'coffee': 'espresso'}})
      .using('options', {sync: true})
    
    .does(FindOne, 'looky').using('collection').from('cxt:narf').using('filter', {'doc': 1})
    .does(common.TriremeClosureCommand, 'test')
      .using('fn', function (cxt, params, cb) {
        var looky = cxt.get('looky');
        //console.log(looky);
        assert.equal(1, looky.doc);
        assert.equal('espresso', looky.coffee);
        cb.done();
      })
    .does(Drop).using('collection', 'narf').using('dbName', 'prontoTest')
    .does(Close).using('dbName', 'prontoTest')
;

common.runPlz('test', reg);