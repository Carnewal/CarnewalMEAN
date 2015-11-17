var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    //We maken cid geen primary key, enkel uniek zodat er later geen problemen
    //ontstaan met relaties wanneer cid moet veranderen.
    cid: {
        type: String,
        required: true, 
        unique: true,  
        index: true
    },
    name: {
        type: String, 
        required: true
    },
    img: {
        type: String,
    },
    description: {
        type: String
    },
    vid: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    related: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});



mongoose.model('Product', ProductSchema); 