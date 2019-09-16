//	Requirements
const mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

//	Schemas
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	email: String,
	avatar: { type: String, default: 'https://picsum.photos/400' },
	isAdmin: { type: Boolean, default: false }
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

//	Export
module.exports = User;
