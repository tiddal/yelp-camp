//	Requirements
const mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

//	Schemas
const userSchema = new mongoose.Schema({
	username: String,
	password: String
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

//	Export
module.exports = User;
