var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        defalut: true
    },
    lastname: {
        type: String,
        defalut: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: {
        type: String
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);