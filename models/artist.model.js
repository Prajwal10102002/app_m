const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    // Define artist schema fields here
    artistid: Number,
    first_name: String,
    last_name: String,
    wiki_url: String,
    profile_url: String,
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
    // Add more fields as needed
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
