
/*
 * GET users listing.
 */

exports.mapRoute = function(app, prefix){
	//var prefixObj = require('../controllers' + prefix);
	var prefixObj = require('../controllers/users.js');

	// create
	// app.post('/users/create', prefixObj.create);

	// new
	// app.get('/users/new', prefixObj.new); 

	// show
	app.get('/users/:sn', prefixObj.show);
};
