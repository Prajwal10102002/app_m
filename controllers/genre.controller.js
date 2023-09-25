// Import any necessary models or modules
const Genre = require('../models/genre.model');

// Define controller methods
exports.findAllGenres = (req, res) => {
    Genre.find()
        .then((genres) => {
            if (!genres || genres.length === 0) {
                return res.status(404).json({ message: "No genres found" });
            }
            res.json({genres:genres});
        })
        .catch((err) => {
            console.error("Error fetching genres:", err);
            res.status(500).json({ message: "Failed to fetch genres" });
        });
};


