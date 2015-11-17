var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    cid: String,
    name: String,
    img: String,
    description: String,
    vid: String,
    price: {type: Number, default: 0} ,
    related: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]    
});



mongoose.model('Product', ProductSchema); 