var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create User model
var User = new Schema({
	sn: {type:String, require: true, trim:true, unique:true},
	name: {type:String, require:true, trim:true},
	password: {type:String, require:true},
});

module.exports = mongoose.model('User', User);
	
