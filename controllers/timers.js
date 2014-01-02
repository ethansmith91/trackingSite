var Timer = require('../models/timers.js');

// controllers for timmer
// every path here assume logged in
// authenticated should be handled in routes/routeConfigure.js

function verifyUser(req){
	if(req.user.fbId != req.params.userId)
	{
		return false;
	}
	return true;
}

function compareDate(d1, d2){
	if(d1.toLocaleDateString() == d2)
		return true;
	return false;
}
// request to read time
// this is a get request
// req.params.userId : id of users
// req.params.localId : localId of timer
// return: if error: title, message, else, json of timer
exports.show = function(req,res){
	/*
	if(req.user.fbId != req.params.userId)
	{
		res.send({title:'Error', message:'Access denied'});
		return;
	}*/
	console.log("local ID " + req.params.localId);
	Timer.find({
		'fbUserId': req.user.fbId,
		'localId': req.params.localId
	}, 
		function(err, doc){
			if(!doc)
				res.json({title:'Error', message:'Timer not found'});
			else
			{
				//console.log(doc);
				res.json(JSON.stringify(doc));
			}
		});
};

// request to read all time
// GET
// req.params.userId: id of users
exports.showAll = function(req,res){
	/*
	if(!verifyUser(req))
	{
		res.send({title:'Error', message:'Access denied'});
		return;
	}*/
	Timer.find({'fbUserId': req.user.fbId}, function(err,doc){
		if(!doc)
			res.json({title:'Error', message:'Timer not found'});
		else
			res.json(JSON.stringify(doc));
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
	console.log("Name is " + name);
	var localId = name + "-" + subject + "-" + testType + parseInt(Math.floor(Math.random() * 1000));
	// TODO : validate subject and testType

	var newTimer = new Timer({
		fbUserId: id,
		localId: localId,
		name: name,
		totalLength: 0,
		subject: {subjectTitle: subject, testTitle: testType}
	});
	newTimer.save(function(err,newTimer){
		if(err) throw err;
		else
		{
			console.log("SAVED SUCCESS");
			res.json(newTimer);
		}
	});
};

// request to update time to existing timer
// POST request
// req.user.fbId: id
// req.body.timerId: timerId
// req.body.newTime: newtime Length
// req.body.current: current date
exports.updateTime = function(req,res){
	// init value from request
	var timerId = req.body.timerId;
	var fbId = req.user.fbId;
	var newTime = req.body.newTime;
	var currentDate = req.body.currentDate;

	// TODO: validate input

	// Look up timer to update
	var myTimer = Timer.findOne({'localId': timerId, 'fbUserId': fbId}, function(err,doc){
		if(err)
			res.send({title:'Error', message:'Timer not found'});
		else{
				doc.totalLength = newTime;
				if(doc.dateToTime.length == 0)
					doc.dateToTime.push({date: currentDate, time:newTime});
				// find if date already exist, it should be in the end
				if(compareDate(doc.dateToTime[doc.dateToTime.length - 1].date,currentDate))
					doc.dateToTime[doc.dateToTime.length - 1].time += newTime;
				// else, create new date with new time
				else
					doc.dateToTime.push({date: currentDate, time:newTime});
				doc.save();
				res.json(doc);
			}
		}
	);
};

// TODO
exports.delete = function(req, res){

};