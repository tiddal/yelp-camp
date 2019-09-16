//	Requirements
const express = require('express'),
	router = express.Router(),
	passport = require('passport');

//  Schemas
const User = require('../models/user');
const Campground = require('../models/campground');

//	Home
router.get('/', (req, res) => {
	res.render('Home');
});

//	Authentication
//	Users	->	NEW
router.get('/register', (req, res) => {
	res.render('users/register');
});
//	Users	->	CREATE
router.post('/register', (req, res) => {
	//const newUser = new User(req.body.newUser);
	const newUser = {
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	};
	User.register(newUser, req.body.password, (err) => {
		err
			? (req.flash('message', { type: 'error', content: err.message + '.' }),
			  res.redirect('register'))
			: passport.authenticate('local')(req, res, () => {
					req.flash('message', {
						type: 'success',
						content: `Hello ${req.body.username}!`
					});
					res.redirect('/campgrounds');
			  });
	});
});
//	Users	->	LOGIN
router.get('/login', (req, res) => {
	res.render('users/login');
});
//	Users	->	VALIDATE
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	})
);
//	Users	->	LOGOUT
router.get('/logout', (req, res) => {
	req.logout(),
		req.flash('message', { type: 'success', content: 'Bye bye!' }),
		res.redirect('/campgrounds');
});

//	User	->	SHOW
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, profile) => {
		err || !profile
			? (req.flash('message', {
					type: 'error',
					content: 'User not found'
			  }),
			  res.redirect('/campgrounds'))
			: Campground.find({ 'author.id': profile.id }, (err, campgrounds) => {
					err
						? (req.flash('message', {
								type: 'error',
								content: 'Something went wrong...'
						  }),
						  res.redirect('back'))
						: res.render('users/Show', {
								profile: profile,
								campgrounds: campgrounds
						  });
			  });
	});
});

//	Export
module.exports = router;
