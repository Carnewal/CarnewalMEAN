var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');

var auth = require('../../util/auth');

/**
 * @param {type} parameter
 * @param {type} callback
 */
router.param('id', function (req, res, next, id) {
    delete req.product;
    console.log("Param id: " + id);
    
    var query = Product.findOne({cid: id});
    query.exec(function (err, product) {
        if (err) {
            return next(err);
        }
        if (!product) {
            return next(new Error('can\'t find product'));
        }

        req.product = product;
        return next();
    });
});

/**
 * @api {post} /api/product/ List
 * @apiName ListProducts
 * @apiGroup Product
 * @apiDescription Toont een lijst van alle producten
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *          [product details]
 *      },
 *      ..
 *     ]
 */
router.get('/', function (req, res, next) {
    Product.find(function (err, products) {
        if (err) {
            return next(err);
        }
        res.json(products);
    });
});
/**
 * @api {post} /api/product/:id Create
 * @apiName CreateProduct
 * @apiGroup Product
 * @apiDescription Creeert een product
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         [product details]
 *     }
 *
 */
router.post('/', function (req, res, next) {

    var product = new Product(req.body);
    product.save(function (err, product) {
        if (err) {
            return next(err);
        }

        res.json(product);
    });
});

/**
 * @api {post} /api/product/:id Update
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiDescription Update een product
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         [product details]
 *     }
 *
 */
router.post('/:id', function (req, res, next) {
    if (!req.product) {
        return next("Product not found");
    }
    Product.findOneAndUpdate({cid: req.product.cid}, req.body, {upsert: true, new : false}, function (err, updatedProduct) {
        if (err)
            return next(err + " ---- " + updatedProduct); 
        res.json(updatedProduct);
    });
});

/**
 * @api {get} /api/product/:id Read
 * @apiName ReadProduct
 * @apiGroup Product
 * @apiDescription Leest een product op :id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         [product details]
 *     }
 *
 */
router.get('/:id', function (req, res, next) {

    res.json(req.product);
    /*
     Product.find(function (err, products) {
     if (err) {
     return next(err);
     }
     res.json(products);
     });*/
});
/**
 * @api {delete} /api/product/:id Delete
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiDescription Verwijdert een product
 *
 * @apiHeader {String} authorization Authorization header-value. Should be in format "Bearer [TOKEN]".
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         message: 'Product deleted'
 *     }
 *
 */
router.delete('/:id', function (req, res, next) {
    req.product.remove();
    res.json("removed")
});


module.exports = router;
