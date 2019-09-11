//	Requirements
// dbURL = 'mongodb://localhost:27017/yelpCamp'
const path = require('path'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	localStrategy = require('passport-local'),
	dbURL = 'mongodb://localhost/yelpCamp',
	port = 3000,
	express = require('express'),
	expressSession = require('express-session'),
	app = express(),
	seedDB = require('./seeds');

//seedDB();
//	Setup
mongoose.connect(dbURL, { useNewUrlParser: true, useFindAndModify: false });
app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(methodOverride('_method'))
	.use(
		expressSession({
			secret: 'toAbg8jYWt',
			resave: false,
			saveUninitialized: false
		})
	)
	.use(flash())
	.set('view engine', 'ejs')
	.set('views', path.join(__dirname, 'views'))
	.listen(port, () => {
		console.log(`Serving on port: ${port}`);
	});

//	Passport
const User = require('./models/user');
app
	.use(passport.initialize())
	.use(passport.session())
	.use((req, res, next) => {
		res.locals.user = req.user;
		res.locals.message = req.flash('message');
		next();
	});
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//	Routes
const campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');
app
	.use(indexRoutes)
	.use('/campgrounds', campgroundRoutes)
	.use('/campgrounds/:id/comments', commentRoutes);
