var express = require('express');

//var  PostController = require('../controllers/post.controller');
var UserController = require('../controllers/user.controller');
var ProtectedController = require('../controllers/protected.controller');
var AnonymousController  = require('../controllers/anonymous.controller');
var router = express.Router();

// Get all Posts
//router.route('/getPosts').get(PostController.getPosts);

// Get one post by title
//router.route('/getPost').get(PostController.getPost);

// Add a new Post
//router.route('/addPost').post(PostController.addPost);

// Delete a Post
//router.route('/deletePost').post(PostController.deletePost);

/**** routes for userController ****/
router.route('/users').post(UserController.getUser);
router.route('/sessions/create').post(UserController.sessionCreate);


router.route('/api/protected/random-quote').get(ProtectedController.randomQuote);
router.route('/api/random-quote').get(AnonymousController.anonymousQuote); 
module.exports = router;

