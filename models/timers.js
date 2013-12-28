var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// TODO: add name
var TimerSchema = new mongoose.Schema({
	fbUserId: {type: String, require: true}, // id of the facebookuser associated
	name: {type: String, require: true},
	dateOfCreation : {type: Date, default: Date.now},
	totalLength : {type: Number, min: 0},
	dateToTime: [{date: Date, time: Number}],
	subject: {
		subjectTitle : {type: String},
		testTitle: {type: String}
	}
});

module.exports = mongoose.model('Timer', TimerSchema);