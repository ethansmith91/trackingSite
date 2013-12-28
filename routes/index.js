
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.user)
		res.render('index', {title: 'Welcome to Tracking Site', user: req.user})
	else
		res.render('index', { title: 'Express' });
};
