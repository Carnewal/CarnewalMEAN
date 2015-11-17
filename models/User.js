var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
   wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}] 
    
});



mongoose.model('User', UserSchema);