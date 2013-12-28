//var User = require('../models/users.js');
var FacebookUser = require('../models/facebookUsers.js');
//var crypto = require('crypto');

// index listing of users at /users : TODO

// display new user form
/*
exports.new = function(req,res){
	console.log(req.url);
	console.log("HELLO");
	//res.send("Hello new user");
	res.render('users/newUser', {title:"New User Form"});
};
*/ 

// create a new user
/*
exports.create = function(req, res){
	var shaShum = crypto.createHash('sha256');
	shaShum.update(req.body.password);

	var user = {
	sn : req.body.usersn,
	name: req.body.username,
	password: shaShum.digest('hex')
	};

	var userObj = new User(user);
	userObj.save(function(err,data){
		if(err)
			res.send(err);
		else
			res.render('users/added', {title: 'Users added', user:user});
	});
};
*/
exports.show = function(req,res){
	var sn = req.params.sn;
	FacebookUser.findOne({fbId:sn}, function(err,doc){
		if(!doc)
			res.send('There is no user with that sn');
		else
			res.render('users/show', {title:'Show user', user:doc});
	});
};
