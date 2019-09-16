//	Requirements
const express = require('express'),
	router = express.Router(),
	middleware = require('../middleware');

//	Schemas
const Campground = require('../models/campground'),
	Comment = require('../models/comment');

//	Campgrounds	->	INDEX
router.get('/', (req, res) => {
	const perPage = 8,
		pageQuery = parseInt(req.query.page),
		pageNumber = pageQuery ? pageQuery : 1;
	Campground.find({})
		.skip(perPage * pageNumber - perPage)
		.limit(perPage)
		.exec((err, campgrounds) => {
			Campground.countDocuments().exec((err, count) => {
				err
					? console.log(err)
					: res.render('campgrounds/Index', {
							campgrounds: campgrounds,
							current: pageNumber,
							pages: Math.ceil(count / perPage)
					  });
			});
		});
});
//	Campgrounds	->	NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/New');
});
//	Campgrounds	->	CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
	req.body.campground.author = { id: req.user.id, username: req.user.username };
	Campground.create(req.body.campground, (err) => {
		err ? console.log(err) : res.redirect('/campgrounds');
	});
});
//	Campgrounds	->	SHOW
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, campground) => {
			err
				? console.log(err)
				: res.render('campgrounds/Show', { campground: campground });
		});
});
//	Campgrounds	->	EDIT
router.get(
	'/:id/edit',
	middleware.isLoggedIn,
	middleware.checkCampgroundOwnership,
	(req, res) => {
		Campground.findById(req.params.id, (err, campground) => {
			err
				? res.redirect('/campgrounds')
				: res.render('campgrounds/Edit', { campground: campground });
		});
	}
);
//	Campgrounds	->	UPDATE
router.put(
	'/:id',
	middleware.isLoggedIn,
	middleware.checkCampgroundOwnership,
	(req, res) => {
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err) => {
			err
				? res.redirect('/campgrounds')
				: res.redirect('/campgrounds/' + req.params.id);
		});
	}
);
//	Campgrounds	->	DELETE
router.delete(
	'/:id',
	middleware.isLoggedIn,
	middleware.checkCampgroundOwnership,
	(req, res) => {
		Campground.findByIdAndDelete(req.params.id, (err, campground) => {
			err
				? res.redirect('/campgrounds')
				: Comment.deleteMany({ _id: { $in: campground.comments } }, (err) => {
						err ? console.log(err) : res.redirect('/campgrounds');
				  });
		});
	}
);

//	Export
module.exports = router;
