var Timer = require('../models/timers.js');

function verifyUser(req){
	if(req.user.fbId != req.params.userId)
	{
		return false;
	}
	return true;
}
// request to read time
// this is a get request
// req.params.userId : id of users
// req.params.subject: subject
// req.params.testType: type of test
// return: if error: title, message, else, json of timer
exports.show = function(req,res){
	if(req.user.fbId != req.params.userId)
	{
		res.send({title:'Error', message:'Access denied'});
		return;
	}
	Timer.findOne({
		'fbUserId': req.params.userId,
		'subject.subjectTitle': req.params.subject,
		'subject.testTitle': req.params.testType}, 
		function(err, doc){
			if(!doc)
				res.send({title:'Error', message:'Timer not found'});
			else
				res.send(doc);
		});
};

// request to read all time
// GET
// req.params.userId: id of users
exports.showAll = function(req,res){
	if(!verifyUser(req))
	{
		res.send({title:'Error', message:'Access denied'});
		return;
	}
	Timer.find({'fbUserId': req.params.userId}, function(err,doc){
		if(!doc)
			res.send({title:'Error', message:'Timer not found'});
		else
			res.send(doc);
	});
};

// request to create new timer
// POST request
// req.user.fbId: id
// req.body.subject: subject
// req.body.testType: type of test
// req.body.name: name of test
// return if error, title and message, else, json of newly create object
exports.create = function(req,res){
	var id = req.user.fbId;
	var subject = req.body.subject;
	var testType = req.body.testType;
	var name = req.body.name;
	console.log(subject);
	console.log(testType);
	// TODO : validate subject and testType

	var newTimer = new Timer({
		fbUserId: id,
		name: name,
		totalLength: 0,
		subject: {subjectTitle: subject, testTitle: testType}
	});
	newTimer.save(function(err,newTimer){
		if(err) throw err;
	});
	res.send(newTimer);
};

// request to update existing timer
// POST request
// req.user.fbId: id
// req.body.timerId: timerId
// req.body.newTime: newtime Length
// req.body.current: current date
exports.update = function(req,res){

};

exports.delete = function(req, res){

};