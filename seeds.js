const mangoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment');

const data = [
	{
		name: 'Mountain Camp',
		img:
			'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
		description: 'Camp in the moutains!'
	},
	{
		name: 'Beach Camp',
		img:
			'https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
		description: 'Camp on the beach!'
	},
	{
		name: 'Road Camp',
		img:
			'https://images.unsplash.com/photo-1563466543438-7cd384614d8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
		description: 'Camp near the road!'
	},
	{
		name: 'Night Camp',
		img:
			'https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
		description: 'Camp in the beautiful night of Archer River!'
	}
];

function seedDB() {
	Campground.deleteMany({}, (err) => {
		err ? console.log(err) : console.log('Removed campgrounds'),
			Comment.deleteMany({}, (err) => {
				err ? console.log(err) : console.log('Removed comments'),
					data.forEach((seed) => {
						Campground.create(seed, (err, campground) => {
							err
								? console.log(err)
								: Comment.create(
										{ text: 'What a wonderful campground!', author: 'tiddal' },
										(err, comment) => {
											err
												? console.log(err)
												: campground.comments.push(comment),
												campground.save();
										}
								  );
						});
					});
			});
	});
}

module.exports = seedDB;
