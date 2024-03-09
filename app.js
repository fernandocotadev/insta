if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// const catchAsync = require("./utils/catchAsync");
// const Joi = require("joi");
// const { postSchema, commentSchema } = require("./schemas.js");
// const Post = require("./models/post");
// const Comment = require('./models/comment')
// const posts = require('./routes/posts');
// const comments = require('./routes/comments');

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))




const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://*.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://ka-f.fontawesome.com/",
];
const fontSrcUrls = [
    "https://use.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://fonts.gstatic.com/",
    "https://res.cloudinary.com/djwmkwg8x/",
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djwmkwg8x/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls]
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/posts', postRoutes)
app.use('/posts/:id/comments', commentRoutes)

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  console.log("* APP . ALL - CATCH ALL STAR * - EXPRESS ERROR PAGE NOT FOUND 404  *");
  next(new ExpressError("* Page Not Found *", 404));
});

app.use((err, req, res, next) => {
  console.log("* APP . USE - ERR MESSAGE && SOMETHING WENT WRONG  *");
  const { statusCode = 500 } = err;

  if (!err.message) err.message = "* Oh No, Something Went EERILY wrong - yipe! *";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("-PORT-3000-");
});
