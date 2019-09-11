//	Requirements
const express = require('express'),
	router = express.Router({ mergeParams: true }),
	middleware = require('../middleware');

//  Schemas
const Comment = require('../models/comment'),
	Campground = require('../models/campground');

//	Comments	->	NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		err
			? console.log(err)
			: res.render('comments/New', { campground: campground });
	});
});
//	Comments	->	CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		err
			? console.log(err)
			: Comment.create(req.body.comment, (err, comment) => {
					err ? console.log(err) : (comment.author.id = req.user.id),
						(comment.author.username = req.user.username),
						comment.save(),
						campground.comments.push(comment),
						campground.save(),
						res.redirect('/campgrounds/' + campground.id);
			  });
	});
});
//	Comments	->	EDIT
router.get(
	'/:comment_id/edit',
	middleware.isLoggedIn,
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findById(req.params.comment_id, (err, comment) => {
			err
				? res.redirect('back')
				: res.render('comments/Edit', {
						comment: comment,
						campground: req.params.id
				  });
		});
	}
);
//	Comments	->	UPDATE
router.put(
	'/:comment_id',
	middleware.isLoggedIn,
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findByIdAndUpdate(
			req.params.comment_id,
			req.body.comment,
			(err) => {
				err
					? res.redirect('back')
					: res.redirect('/campgrounds/' + req.params.id);
			}
		);
	}
);
//	Comments	->	DELETE
router.delete(
	'/:comment_id',
	middleware.isLoggedIn,
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findByIdAndDelete(req.params.comment_id, (err) => {
			err
				? res.redirect('back')
				: res.redirect('/campgrounds/' + req.params.id);
		});
	}
);

//	Export
module.exports = router;
