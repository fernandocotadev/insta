const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors , urls, usernameStart, usernameEnding } = require('./seedHelpers');
const Post = require('../models/post');

const uri = "mongodb+srv://fernando:fc394200@cluster0.wcj1x48.mongodb.net/";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("#MONGO - connection open ! ! !");
  })
  .catch((err) => {
    console.log("MONGO - Oh no, error - ");
    console.log(err);
  });

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const post = new Post({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: `${sample(descriptors)} ${sample(places)}`,
            url: `${sample(urls)}`,
            username: `${sample(usernameStart)}_${sample(usernameEnding)}`
        })
        await post.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})