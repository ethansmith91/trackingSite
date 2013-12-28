var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FacebookUserSchema = new mongoose.Schema({
	fbId: {type:String, require: true},
	email: {type: String, lowercase:true},
	name: {type:String, require: true}
});

module.exports = mongoose.model('FacebookUser', FacebookUserSchema);