//	Requirements
const mongoose = require('mongoose');

//	Schemas
const campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String,
	price: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
const Campground = mongoose.model('Campground', campgroundSchema);

//	Export
module.exports = Campground;
