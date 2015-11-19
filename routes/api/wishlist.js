var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var Wishlist = mongoose.model('Wishlist');
var Product = mongoose.model('Product');
var User = mongoose.model('User');

var auth = require('../../util/auth');

router.param('product', function (req, res, next, id) {
    var query = Product.findOne({cid: id});

    query.exec(function (err, product) {
        if (err) {
            return next(err);
        }
        if (!product) {
            return next(new Error('Can\'t find product'));
        }

        req.product = product;
        return next();
    });
});


/**
 * @api {get} /api/wishlist/ Get Wishlist
 * @apiName WishlistGet
 * @apiGroup Wishlist
 * @apiDescription Retourneert de wishlist van de geauthenticeerde gebruiker.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *          [wishlist details]
 *      },
 *      ..
 *     ]
 */
router.get('/', auth, function (req, res, next) {
    
    User.populate(req.user, {path: 'wishlist'}, function (err, user) {
        if (err) {
            return next(err);
        }
        res.json(user.wishlist);
    });

});

/**
 * @api {put} /api/wishlist/:product/:amount Product Append
 * @apiName WishlistProductAdd
 * @apiGroup Wishlist
 * @apiDescription Product toevoegen, verwijderen of aantallen aanpassen.
 * 1. Gebruik de product.cid als :product parameter!
 * 2. Als het product zich niet in de lijst bevindt wordt dit aangemaakt.
 * 3. Als het product zich wel in de lijst bevindt wordt product.amount op 
 * :amount gezet.
 * 4. Om te verwijderen, zet :amount op 0. 
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
router.put('/:product/:amount', auth, function (req, res, next) {
    if (req.user === 'undefined') {
        return next("Couldn't find user");
    }

    User.populate(req.user, {path: 'wishlist'}, function (err, user) {
        user.wishlist.append(req.product, req.params.amount, function (err, k) {
            if (err) {
                return next("Could not save");
            }
            res.json(k);
        });
        // user.wishlist verandert anders in een json in de databank
        // Veel op gezocht maar geen oplossing gevonden, daarom deze "hack"
        user.wishlist = user.wishlist._id;

    });
});




module.exports = router;
