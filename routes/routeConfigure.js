exports.mapRoute = function(app, prefix){
	var prefixObj = require('../controllers/timers.js');

	// for every access, set content-type. Require log in
	app.all('/timers/*', function(req,res,next){
		if(req.user)
		{
			res.set('Content-Type', 'json');
			next();
		}
		else
			res.redirect('/');
	});

	// tesst
	app.get('/timers/new', function(req,res){
		res.render('newTimer');
	});
	//end test

	app.post('/timers/create', prefixObj.create);
	app.post('/timers/update', prefixObj.update);
	app.get('/timers/:userId', prefixObj.showAll);
	app.get('/timers/:userId/:subject/:testType', prefixObj.show);
};