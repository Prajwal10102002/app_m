const Artist = require('../models/artist.model');

exports.findAllArtists = (req, res) => {
    // Use the Mongoose model to query the database and retrieve all artists
    Artist.find()
        .then(artists => {
            // Send the retrieved artists as a JSON response
            res.json({artists:artists});
        })
        .catch(err => {
            console.error('Error fetching artists:', err);
            // Handle the error and send an error response
            res.status(500).json({ message: 'Failed to fetch artists' });
        });
};
