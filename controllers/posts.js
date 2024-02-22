const Post = require('../models/post');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
 

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
}


module.exports.gallery = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/gallery', { posts })
}


module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
}

module.exports.createPost = async (req, res, next) => {

    console.log("* CREATE * Post -- req.body.POST -- ")
    console.log(req.body.post)
    console.log("* CREATE * Post -- req.body.LOCATION -- ")
    console.log(req.body.post.location)
    console.log("* CREATE * Post -- req.body.LOCATION -- TYPE OF - ")
    console.log(typeof req.body.post.location)

    const geoData = await geocoder.forwardGeocode({
        query: req.body.post.location,
        limit: 1
    }).send()

    console.log("* GEO DATA *")
    console.log(geoData)
    console.log("* GEO DATA - GEOMETRY *")
    console.log(geoData.body.features[0].geometry)

    const post = new Post(req.body.post);
    post.geometry = geoData.body.features[0].geometry;
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.author = req.user._id;
    
    let currentDate = new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    post.lastEdit = currentDate;
    post.likes = Math.floor(Math.random() * 1000);

    console.log("* CREATE * POST IMAGES * * * ")
    console.log(post.images)


    // if(!post.images){
    //     post.images = [
    //         {
    //         url= "https://res.cloudinary.com/djwmkwg8x/image/upload/v1705443418/MicroGram/vb5jecfqelbkmrqrlldb.png",
    //         filename= "YelpCamp/ahfnenvca4tha00h2ubt",
    //         _id= b5c1789c666cdacabbh7m12d
    //     }
    //     ]
    // }
    await post.save();

    console.log("CREATE - POST  - ");
    console.log(post);
    
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/posts/${post._id}`)
}

module.exports.showPost = async (req, res,) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
}

module.exports.updatePost = async (req, res) =>  {
    const { id } = req.params;
    console.log("###  UPDATE ###");
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    let currentDate = new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    post.lastEdit = currentDate;
    await post.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`)
    
}


module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/posts');
}