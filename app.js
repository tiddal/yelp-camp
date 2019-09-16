//	Requirements
const path = require('path'),
	env = require('dotenv').config(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	localStrategy = require('passport-local'),
	port = process.env.PORT || 3000,
	express = require('express'),
	expressSession = require('express-session'),
	app = express();

//	Setup
mongoose
	.connect(process.env.DATABASEURL, {
		useNewUrlParser: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log(
			`Successfully connected to the database on ${process.env.DATABASEURL}`
		);
	})
	.catch((err) => {
		console.log(`Failed to connect connected to the database: ${err.message}`);
	});
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
	.use(express.static(__dirname + '/public'))
	.listen(port, process.env.IP, () => {
		console.log(`Server running on port ${port}...`);
	});

//	Moment.js
app.locals.moment = require('moment');

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

app.get('*', (req, res) => {
	res.redirect('/campgrounds');
});
