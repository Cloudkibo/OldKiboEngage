var Post = require('../models/post');
var cuid = require('cuid');
var slug = require('slug');
var sanitizeHtml = require('sanitize-html');

exports.getPosts = function(req, res) {
  Post.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ posts });
  });
}

exports.addPost = function(req, res) {
  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
    return res.status(403).end();
  }

  const newPost = new Post(req.body.post);

  // Let's sanitize inputs
  newPost.title = sanitizeHtml(newPost.title);
  newPost.name = sanitizeHtml(newPost.name);
  newPost.content = sanitizeHtml(newPost.content);

  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();
  newPost.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ post: saved });
  });
}

exports.getPost = function(req, res) {
  const newSlug = req.query.slug.split('-');
  const newCuid = newSlug[newSlug.length - 1];
  Post.findOne({ cuid: newCuid }).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ post });
  });
}

exports.deletePost = function(req, res) {
  const postId = req.body.postId;
  Post.findById(postId).exec((err, post) => {
    if (err) {
      return res.status(500).send(err);
    }

    post.remove(() => {
      res.status(200).end();
    });
  });
}
