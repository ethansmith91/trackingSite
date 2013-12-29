exports.mapRoute = function(app){
	var prefixObj = require('../controllers/timers.js');

	// for every access, set content-type. Require log in
	app.all('/api/*', function(req,res,next){
		if(req.user)
		{
			res.set('Content-Type', 'json');
			next();
		}
		else
			res.redirect("/");
	});

	// tesst
	app.get('/timers/new', function(req,res){
		res.render('newTimer');
	});
	//end test

	// api for Timers
	app.post('/api/timers/create', prefixObj.create);
	app.post('/api/timers/updateTime', prefixObj.updateTime);
	app.get('/api/timers/:userId', prefixObj.showAll);
	app.get('/api/timers/:userId/:subject/:testType', prefixObj.show);
};