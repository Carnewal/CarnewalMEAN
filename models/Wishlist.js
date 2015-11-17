var mongoose = require('mongoose');

var WishlistEntrySchema = new mongoose.Schema({
    // the amount of products the user wishes
    amount: Number,
    // the last update Date
    updated_at: Date,
    // the product the user wishes
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
});
 
WishlistEntrySchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

var WishlistSchema = new mongoose.Schema({
    // if the user sent us the wishlist
    submitted: Boolean,
    // if the user chose to clear the wishlist
    cleared: Boolean,
    // a message the user left on his wishlist
    message: String,
    // the array of wishlist product entries
    entries: [WishlistEntrySchema]
});



WishlistSchema.methods.append = function(product, callback) {
  
  this.save(callback);
};

WishlistSchema.methods.remove = function(product, callback) {
  this.save(callback);
};

WishlistSchema.methods.plus = function(product, callback) {
  this.save(callback);
};

WishlistSchema.methods.minus = function(product, callback) {
  this.save(callback);
};

mongoose.model('Wishlist', WishlistSchema);