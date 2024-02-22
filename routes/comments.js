const express = require('express');
const router = express.Router({ mergeParams: true });
const Post = require('../models/post');
const Comment = require('../models/comment');
const { commentSchema } = require('../schemas.js');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments')

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;


