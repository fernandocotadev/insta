const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    url: String,
    likes: Number  
}) 

module.exports = mongoose.model('Post', PostSchema);