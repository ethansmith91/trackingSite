var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

//login route
exports.mapRoute = function(app)
{
	app.get("/auth/facebook", passport.authenticate("facebook", {scope: "email"}));
	app.get("/auth/facebook/callback",
		passport.authenticate("facebook", {failureRedirect: '/login'}),
		function(req,res){
			res.redirect("/");
			//res.render("users/show", {title: 'Welcome User', user: req.user});
		}
	);

	//logout route
	app.get("/logout", function(req,res){
		req.logout();
		res.redirect('/');
	})

	// api to get user
	app.get("/api/isLoggedIn", function(req, res){
		res.set('Content-Type', 'json');
		if(req.user)
		{
			console.log("IM LOGGED " + req.user.name);
			res.send({isLoggedIn: 'true'});
		}
		else
		{
			console.log("IM NOT BRO");
			res.send({isLoggedIn: 'false'});
		}
	});
}