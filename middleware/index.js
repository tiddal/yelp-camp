//	Schemas
const Campground = require('../models/campground'),
	Comment = require('../models/comment');

//  Middlewares
const middlewareObj = {};
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	Campground.findById(req.params.id, (err, campground) => {
		err || !campground
			? res.redirect('/campgrounds')
			: campground.author.id.equals(req.user.id)
			? next()
			: res.redirect('/campgrounds');
	});
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		err || !comment
			? res.redirect('/campgrounds')
			: comment.author.id.equals(req.user.id)
			? next()
			: res.redirect('/campgrounds');
	});
};

middlewareObj.isLoggedIn = (req, res, next) => {
	req.isAuthenticated()
		? next()
		: (req.flash('message', {
				type: 'info',
				content: 'You must be logged in!'
		  }),
		  res.redirect('/login'));
};

//  Export
module.exports = middlewareObj;
