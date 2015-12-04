var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/**
 * Inject the Post :post into the request param
 *
 */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

/**
 * Inject the Comment :comment into the request param
 *
 */
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});
/**
 * @api {post} /api/register User Local Registration
 * @apiName PostRegister
 * @apiGroup Index
 *
 * @apiParam {String} email Users Email Address
 * @apiParam {String} password Users Plain-Text Password
 * @apiParam {String} firstname Users First Name
 * @apiParam {String} lastname Users Last Name
 * @apiParam {String} gender Users Gender
 * @apiParam {String} birthday Users Gender
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": [GENERATED JWT TOKEN]
 *     }
 *
 *
 */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});


/**
 * @api {post} /posts Create a post
 * @apiName PostRegister
 * @apiGroup Index
 *
 * @apiParam {String} email Users Email Address
 * @apiParam {String} password Users Plain-Text Password
 * @apiParam {String} firstname Users First Name
 * @apiParam {String} lastname Users Last Name
 * @apiParam {String} gender Users Gender
 * @apiParam {String} birthday Users Gender
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": [GENERATED JWT TOKEN]
 *     }
 *
 *
 */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post){
    if(err){ return next(err); }
    res.json(post);
  });
});


router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
})


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});




router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/ 

module.exports = router;
