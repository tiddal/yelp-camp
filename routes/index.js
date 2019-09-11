//	Requirements
const express = require('express'),
	router = express.Router(),
	passport = require('passport');

//  Schemas
const User = require('../models/user');

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
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err) => {
			err
				? (req.flash('message', { type: 'error', content: err.message + '.' }),
				  res.redirect('register'))
				: passport.authenticate('local')(req, res, () => {
						req.flash('message', {
							type: 'success',
							content: `Hello ${req.body.username}`
						});
						res.redirect('/campgrounds');
				  });
		}
	);
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

//	Export
module.exports = router;
