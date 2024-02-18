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



// const validateComment = (req, res, next) => {
//     const { error } = commentSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


// router.post('/', validateComment, catchAsync(async (req, res) => {

//   const post = await Post.findById(req.params.id);
//   const comment = new Comment(req.body.comment);
//   post.comments.push(comment);
//   console.log("comment");
//   console.log(comment);
//   console.log("comment");
//   await comment.save();
//   await post.save();
//   req.flash('success', 'Successfully created comment')
//   res.redirect(`/posts/${post._id}`);

// }))

// router.delete('/:commentId', catchAsync(async (req, res) => {

//     const { id, commentId } = req.params;
//     await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
//     await Comment.findByIdAndDelete(commentId);
//     req.flash('success', 'Successfully Deleted comment')
//     res.redirect(`/posts/${id}`);

// }))



