var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


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

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){

  console.log(posts);
    if(err){ return next(err); }

    res.json(posts);
  });
});



router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  console.log(post);

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


router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;
  
  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});




router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {

  req.comment.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });

});

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {

  req.comment.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });

});



/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/ 

module.exports = router;
