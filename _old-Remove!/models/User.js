var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var geoip = require('geoip-lite');

var Wishlist = mongoose.model('Wishlist');

var UserSchema = new mongoose.Schema({
    username: { 
        type: String,
        lowercase: true,
        unique: true
    },
    hash: String,
    salt: String,
    email: String,   
    rights: {
        type: Number,
        default: 0
    },
    
    // Geolocation
    locationUpdate: Date,
    ip: String,
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    
    //Wishlist
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    },
    //Wishlists
    wishlists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    },
    //likes
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]

});


UserSchema.methods.refreshLocation = function (req) {
    this.ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (this.ip === "::1") {this.ip = "78.22.100.25";}
    var geo = geoip.lookup(this.ip);
    this.locationUpdate = new Date();
    this.country = geo.country;
    this.region = geo.region;
    this.city = geo.city;
    this.latitude = geo.ll[0];
    this.longitude = geo.ll[1];
};

UserSchema.methods.setup = function() {
    var wl = new Wishlist();
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

mongoose.model('User', UserSchema);