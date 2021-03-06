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

    Wishlist.findOne({owner: req.user.id}).populate('entries').lean().exec(function (err, wishlist) {
        if (err) {
            return next(err);
        }
        Wishlist.populate(wishlist, {path: 'entries.product'}, function (err, uwl) {
            console.log(uwl);
            if (err) {
                return next(err);
            }
            res.json(uwl);
        });
    });

});
/**
 * @api {get} /api/wishlist/all Get All Wishlist
 * @apiName WishlistGetAll
 * @apiGroup Wishlist
 * @apiDescription Retourneert alle wishlists 
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
router.get('/all', auth, function (req, res, next) {

    Wishlist.find().populate('entries').lean().exec(function (err, wishlist) {
        if (err) {
            return next(err);
        }
        Wishlist.populate(wishlist, {path: 'entries.product'}, function (err, uwl) {
            console.log(uwl);
            if (err) {
                return next(err);
            }
            res.json(uwl);
        });
    });

});

/**
 * @api {get} /api/wishlist/all Get All Wishlist
 * @apiName WishlistGetAll
 * @apiGroup Wishlist
 * @apiDescription Retourneert alle wishlists 
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
router.get('/:id', auth, function (req, res, next) {

    Wishlist.find({id: req.params.id}).populate('entries').lean().exec(function (err, wishlist) {
        if (err) {
            return next(err);
        }
        Wishlist.populate(wishlist, {path: 'entries.product'}, function (err, uwl) {
            console.log(uwl);
            if (err) {
                return next(err);
            }
            res.json(uwl);
        });
    });

});

/**
 * @api {put} /api/wishlist/:product/:amount Product Upsert
 * @apiName WishlistProductUpsert
 * @apiGroup Wishlist
 * @apiDescription Product toevoegen of aantallen aanpassen.
 * 1. Gebruik de product.cid als :product parameter!
 * 2. Als het product zich niet in de lijst bevindt wordt dit aangemaakt.
 * 3. Als het product zich wel in de lijst bevindt wordt entries[product].amount
 * naar :amount geupdate.
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
        return next("Couldn't find user " + err);
    }

    User.populate(req.user, {path: 'wishlist'}, function (err, user) {
        if (err) {
            return next(err);
        }
        user.wishlist.upsert(req.product, req.params.amount, function (err, k) {
            if (err) {
                return next("Could not save " + err);
            }
            res.json(k);
        });
        // user.wishlist verandert anders in een json in de databank
        // Veel op gezocht maar geen oplossing gevonden, daarom deze "hack"
        user.wishlist = user.wishlist._id;

    });
});




module.exports = router;
