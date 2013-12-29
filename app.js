
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var authenticateRoute = require('./routes/authenticate');
var FacebookUser = require('./models/facebookUsers.js');
var User = require('./models/users.js');
var Timer = require('./models/timers.js');
var routeConfigure = require('./routes/routeConfigure');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// set up database
mongoose.connect('mongodb://127.0.0.1/TrackingSite', function(err){
	if(err) console.log('Error in MongoDB: ' + err);
	else console.log('Connection to DB on');
	})
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// set up middleware for authentication
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// set up passport authentication with facebook
passport.use(new FacebookStrategy({
	clientID: "177727945687105",
	clientSecret: "d8c0df282b0be52e15561b6180efe720",
	callbackURL: "http://localhost:3000/auth/facebook/callback"
	},	

	function(accessToken, refreshToken, profile, done){
		FacebookUser.findOne({fbId: profile.id}, function(err,oldUser){
			if(oldUser){
				done(null, oldUser);
			}else{
				var newUser = new FacebookUser({
					fbId: profile.id,
					email: profile.emails[0].value,
					name: profile.displayName
				}).save(function(err, newUser){
					if(err) throw err;
					done(null, newUser);
				});
			}
		});

		// for testing
		Timer.remove({fbUserId: profile.id}, function(err){
			if(err) throw err;
		});
		Timer.findOne({fbUserId: profile.id}, function(err,old){
			if(!old){
				var newTimer = new Timer({
					fbUserId: profile.id,
					name: "MyTestTimer",
					totalLength: 0,
					subject: {subjectTitle: 'MCAT', testTitle: 'Verbal'}
				})
				newTimer.save(function(err,newTimer){
					if(err) throw err;
				});
			}
		});

		// end testing TODO: REMOVE
	}
));

// set serializer/deserializer which set the user to req.user and establish a session via cookie
passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	FacebookUser.findById(id, function(err, user){
		if(err) done(err);
		if(user){
			done(null, user);
		}else{
			User.findById(id, function(err, user){
				if(err) done(err);
				done(null,user);
			});
		}
	});
});

// TODO : FIX mapRoute to type specific
prefix = "users";

// map authentication
authenticateRoute.mapRoute(app);

// index and other modules routing
user.mapRoute(app,prefix);
routeConfigure.mapRoute(app);
app.get('/*', function(req,res){
	res.sendfile(__dirname + '/public/shell.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
