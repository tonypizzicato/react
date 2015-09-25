"use strict";

var mongoose    = require('mongoose'),
    bcrypt      = require('bcrypt-nodejs'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId,
    SALT_FACTOR = 10;

// User schema
var userSchema = new Schema({
    id: ObjectId,
    dc: {type: Date, default: Date.now},
    du: {type: Date},

    username: {type: String, required: true},
    email:    {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar:   {type: String},
    leagueId: {type: ObjectId},
    position: {type: String},
    roles:    {type: Array, required: true, default: ['user']}
});

userSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        delete ret.password;
        delete ret.dc;
        return ret;
    }
};

// Bcrypt middleware
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(SALT_FACTOR));
    console.log(user.password);
    next();
});

// Password verification
userSchema.methods.verifyPassword = function (candidatePassword) {
    var equal = true;

    if (!bcrypt.compareSync(candidatePassword, this.password)) {
        equal = false
    }

    return equal;
};

// Export user model
module.exports = mongoose.model('User', userSchema, 'users');
