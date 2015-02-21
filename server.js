var bodyParser = require('body-parser'); 
var bcrypt = require('bcryptjs');
var csrf = require('csurf');

var express = require('express');
var app = express();
//var mongojs = require('mongojs');
//var db = mongojs('accountList', ['accountList']);
var mongoose = require('mongoose');
var sessions = require('client-sessions');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//connect to mongo
mongoose.connect('mongodb://localhost/newAccountList');


//orm
var User = mongoose.model('User', new Schema({
	id: ObjectId,
	firstName: String,
	lastName: String,
	email: { type: String, unique: true },
	password: String,
}));



app.set('view engine', 'jade');
app.locals.pretty = true; // don't minify when viewing page source on browser



//middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); //convert body of http to json

app.use(sessions({
	cookieName: 'session',
	secret: 'randomstring',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true, // dont let browser javascript access cookies ever
	secure: true, // only user cookies over https (ssl)
	ephemeral: true, //delete this cookie when the browser is closed
}));

app.use(csrf());// user csrf for page where user can input data, this prevents cross site forgery

//GLOBAL middleware
//this middleware is going to run everytime a user visit any page and handle session
app.use(function(req, res, next) {
	if (req.session && req.session.user) {
		User.findOne({ email: req.session.user.email }, function(err, user) {
			if (user) {
				req.user = user; //populate variable called req.user for client
				delete req.user.password; // safety
				req.session.user = req.user; 
				res.locals.user = req.user; // to work for all templates
			}
			next();
		});
	} else {
		next();
	}
})

//NON-GLOBAL middleware
//this middleware runs after the first one right above, and redirect to login page if there
//is not req.user variable set at the first middleware
//BUT we need to explictly call this function unlike the first one like in dashboard
function requireLogin(req, res, next) {
	if (!req.user) {
		req.redirect('/login');
	} else {
		next();
	}
}


app.get('/accountList', function (req, res){
	console.log("I received a GET request")
 

	db.accountList.find(function (err, docs){ 
		console.log(docs);
		res.json(docs);
	});

});

app.get('/ang', function(req, res) {
	res.render('ang.jade');
});




app.get('/', function(req, res) {
	res.render('index.jade');
});

app.get('/register', function(req, res) {
	res.render('register.jade', { csrfToken: req.csrfToken() });
});

app.post('/register', function(req, res) {
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); //use bcrypt hash for password
	//res.json(req.body);  
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hash,
	});
	user.save(function(err) {
		if (err) {
			var err = 'Something bad happened!  Try again!'; 
			if (err.code === 11000) {
				error = 'That email is already taken, try another.';
			}
			res.render('register.jade', {error: error}); 
		} else {
			res.redirect('/dashboard');
		}

	})
});

app.get('/login', function(req, res) {
	res.render('login.jade' , { csrfToken: req.csrfToken() });
});

app.post('/login', function(req, res) {
	User.findOne({ email: req.body.email }, function(err, user) {
		if(!user) {
			res.render('login.jade', { error: 'Invalid email or password.' });
		} else {
			if (bcrypt.compareSync(req.body.password, user.password)/*req.body.password === user.password*/) {
				req.session.user = user; // store session data if login was successful
											// set-cookie: session={ email: '..', password: '..', ..}
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', { error: 'Invalid email or passowrd.' });
			}
		}
	});
});

//version WITHOUT using middleware
/*
app.get('/dashboard', function(req, res) {
	if(req.session && req.session.user) {
		User.findOne({ email: req.session.user.email }, function(err, user) {
			if(!user) {
				req.session.reset();
				res.redirect('/login');
			} else {
				res.locals.user = user; // set the local value user for dashbaord.jade
				res.render('dashboard.jade');
			}
		});
	} else {
		res.redirect('/login');
	}
});
*/
//version WITH using middleware
app.get('/dashboard', requireLogin, function(req, res) {
	res.render('dashboard.jade');
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});


app.listen(3000);