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
    entries: [WishlistEntrySchema],
    //the User
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    
    
});


/**
 * Append a product or update its amount
 * 
 * @param {type} product
 * @param {type} amount
 * @param {type} callback
 * @returns {undefined}
 */
WishlistSchema.methods.upsert = function (product, amount, callback) {
    var index = -1;
    
    if (typeof this.entries != "undefined" && this.entries != null 
            && this.entries.length > 0) {           
        for (var i = 0, num = this.entries.length; i < num; i++) {
            if (this.entries[i].product.toString() === product.id.toString()) {
                index = i;
            }
        }
    }
    // If there are 0 entries or the entry is not in the entries array
    if (index === -1) {
        this.entries.push({product: product, amount: amount});
    } else {
        this.entries[index].amount = amount;
    }

    this.save(callback);
};




mongoose.model('Wishlist', WishlistSchema);