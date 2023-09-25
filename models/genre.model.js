const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    genreid: Number,
    genre: String,
    // Add more fields as needed
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
