var pronto = require('pronto');

exports.TriremeTestCommand = TriremeTestCommand;
exports.TriremeClosureCommand = TriremeClosureCommand;
exports.NoOp = NoOp;

exports.canHazReg = canHazReg;
exports.runPlz = runPlz;


function TriremeTestCommand() {}
pronto.inheritsCommand(TriremeTestCommand);

TriremeTestCommand.prototype.execute = function (cxt, params) {
	//console.log('In Trireme Test');
	//console.log(cxt);
	
	this.done('Trireme test complete');
}

function TriremeClosureCommand(){}
pronto.inheritsCommand(TriremeClosureCommand);

TriremeClosureCommand.prototype.execute = function(cxt, params) {
	var fn = params.fn;
	var args = params.args || [];
	
	fn.call(this, cxt, args, this);
}

function NoOp() {}
pronto.inheritsCommand(NoOp);

function canHazReg() {
  return new pronto.Registry();
}

function runPlz(requestName, registry, context) {
  var router = new pronto.Router(registry);
  
  router.on('error', function(err, c) {
    console.log('Test harness caught an error');
    console.error(err.stack);
  });
  
  router.handleRequest(requestName, context);
}