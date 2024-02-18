const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePost } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Post = require('../models/post'); 

router.route('/')
    .get(catchAsync(posts.index))
    .post(isLoggedIn, upload.array('image'), validatePost, catchAsync(posts.createPost))

router.get('/new', isLoggedIn, posts.renderNewForm)

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm))



module.exports = router;












// const validatePost = (req, res, next) => {
//     const { error } = postSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }






















// router.get('/', catchAsync(async (req, res) => {
//     const posts = await Post.find({})
//     res.render("posts/index", { posts });
// }));

// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('posts/new');
// })

 
// router.post('/', isLoggedIn, validatePost, catchAsync(async (req, res, next) => {

//     const post = new Post(req.body.post);
//     post.author = req.user._id;
//     await post.save();
//     req.flash('success', 'Successfully created a new post!');
//     res.redirect(`/posts/${post._id}`);

// }))

// router.get('/:id', catchAsync(async (req, res,) => {
//     try {
//         const { id } = req.params;
//         const post = await Post.findById(req.params.id).populate({
//             path: 'comments',
//             populate: {
//                 path: 'author'
//             }
//         }).populate('author');

//         if (!id) {
//           throw new ExpressError("No such product ID", 321);
//         }
//         res.render("posts/show", { post });
//       } catch (e) {
//         next(new ExpressError("PRODUCT ID WAS NOT FOUND", 404));
//       }

// }));

// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         res.render("posts/edit", { post });
//       } catch (e) {
//         next(new ExpressError("THE PRODUCT ID WAS NOT FOUND FOR EDITTING", 404));
//       }

// }))

// router.put('/:id', isLoggedIn, isAuthor, validatePost, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const post = await Post.findByIdAndUpdate(id, { ...req.body.post } );
//     req.flash('success', 'Successfully updated post!');
//     res.redirect(`/posts/${post._id}`);

// }));

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Post.findByIdAndDelete(id);
//     req.flash('success', 'Successfully deleted post')
//     res.redirect("/posts");

// }));





















// app.get("/posts", catchAsync(async (req, res) => {
  
//     const posts = await Post.find({})
//     res.render("posts/index", { posts });
//   }));

  
// app.get("/posts/new", (req, res) => {
//     res.render("posts/new");
//   });
  

// app.post("/posts", validatePost, catchAsync(async (req, res, next) => {
  
//     const post = new Post(req.body.post);
//     await post.save();
//     res.redirect(`/posts/${post._id}`);
  
//   }));
  

// app.get("/posts/:id", catchAsync(async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const post = await Post.findById(req.params.id).populate('comments');
//       if (!id) {
//         throw new ExpressError("No such product ID", 321);
//       }
//       res.render("posts/show", { post });
//     } catch (e) {
//       next(new ExpressError("PRODUCT ID WAS NOT FOUND", 404));
//     }
//   }));
  

// app.get("/posts/:id/edit", catchAsync(async (req, res, next) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       res.render("posts/edit", { post });
//     } catch (e) {
//       next(new ExpressError("THE PRODUCT ID WAS NOT FOUND FOR EDITTING", 404));
//     }
//   }));
  

// app.put("/posts/:id", validatePost, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const post = await Post.findByIdAndUpdate(id, { ...req.body.post } );
//     res.redirect(`/posts/${post._id}`);
//   }));
  

// app.delete("/posts/:id", catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Post.findByIdAndDelete(id);
//     res.redirect("/posts");
//   }));