const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors , usernameStart, usernameEnding } = require('./seedHelpers');
const Post = require('../models/post');

const uri = "mongodb+srv://fernando:fc394200@cluster0.wcj1x48.mongodb.net/instaclone?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("/// MONGO DB - Connection Open. ///");
  })
  .catch((err) => {
    console.log("/// MONGO - Error... /// ");
    console.log(err);
  });

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        let currentDate = new Date();
        console.log(currentDate);
        const post = new Post({
            author: '658f58ae305dfdc97370f240',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
              type: "Point",
              coordinates: [-113.1331, 47.0202]
          },
            description: `${sample(descriptors)} ${sample(places)}`,
            lastEdit: currentDate,
            username: `${sample(usernameStart)}_${sample(usernameEnding)}`,
            likes: random1000,
            images: [
              {
                  url: 'https://res.cloudinary.com/djwmkwg8x/image/upload/v1711377208/MicroGram/h9rntuxfg5jmlrpdem8g.png',
                  filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
              },
              {
                  url: 'https://res.cloudinary.com/djwmkwg8x/image/upload/v1711377208/MicroGram/spcc8htgozosdaho2nq2.png',
                  filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
              }
          ]
        })
        await post.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})