var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');


router.get('/', function (req, res, next) {
    Product.find(function (err, products) {
        if (err) {
            return next(err);
        }
        res.json(products);
    });
});


router.get('/:id', function (req, res, next) {
    Product.find(function (err, products) {
        if (err) {
            return next(err);
        }
        res.json(products);
    });
});
router.post('/add', function (req, res, next) {
    
    var product = new Product(req.body);
    
    product.save(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});


module.exports = router;
