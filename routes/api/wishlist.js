var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Wishlist = mongoose.model('Wishlist');
var Product = mongoose.model('Product');

router.param('product', function(req, res, next, id) {
  var query = Product.findById(id);

  query.exec(function (err, product){
    if (err) { return next(err); }
    if (!product) { return next(new Error('can\'t find product')); }

    req.product = product;
    return next();
  });
});

router.get('/', function(req, res, next) {
    
    Wishlist.findOne({}, function(err, wishlist) {
        if(err) {
            return next(err);
        }
        res.json(wishlist);
    });
});

router.get('/:id/add')

module.exports = router;
