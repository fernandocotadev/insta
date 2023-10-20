const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Post = require("./models/post");

const uri = "mongodb+srv://fernando:fc394200@cluster0.wcj1x48.mongodb.net/";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("#MONGO - connection open ! ! !");
  })
  .catch((err) => {
    console.log("MONGO - Oh no, error - ");
    console.log(err);
  });

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))




app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get("/", (req, res) => {
  res.render("home");
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find({});
  res.render('posts/index', { posts })
});

app.get('/posts/new', (req, res) => {
  res.render('posts/new');
})

app.post('/posts', async (req, res) => {
  const post = new Post(req.body.post);
  await post.save();
  res.redirect(`/posts/${post._id}`)
})

app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
  res.render('posts/show', { post });
});

app.get('/posts/:id/edit', async (req, res) => {
  const post = await Post.findById(req.params.id)
  res.render('posts/edit', { post });
})

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
  res.redirect(`/posts/${post._id}`)
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect('/posts');
})

app.listen(3000, () => {
  console.log("-PORT-3000-");
});
