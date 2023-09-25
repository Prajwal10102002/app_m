// Import any necessary models or modules
// const Movie = require('../models/movie.model');
const Movie = require('../models/movie.model');
const mongoose = require('mongoose');
// Define controller methods
// Function to find all movies by status
exports.findAllMovies = (req, res) => {
    Movie.find()
        .then((movies) => {
            res.json({movies : movies}); // This sends the response to the client
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
  
// Function to find a movie by ID
// exports.findOne = (req, res) => {
//   const { movieId } = req.params; // Get the 'movieId' parameter from the URL
//   console.log(movieId);
//   try {
//     // Create a valid Mongoose ObjectId using the 'new' keyword
//     ///var objectId = new mongoose.Types.ObjectId(movieId);
//     console.log(movieId);  
//     // Use the 'findById' method to retrieve a movie by ID
//     Movie.findOne({_id : movieId})
//       .then((movie) => {
//         if (!movie) {
//           // If movie is not found, send a 404 response
//           return res.status(404).json({ message: 'Movie not found' });
//         }

//         // Send the movie details as JSON response
//         res.json(movie);
//       })
//       .catch((err) => {
//         // Handle any errors that occur during the query
//         res.status(500).json({
//           message: 'Error retrieving movie',
//           error: err,
//         });
//       });
//   } catch (err) {
//     // Handle invalid ObjectId format
//     console.error(err);
//     res.status(400).json({ message: 'Invalid movieId format' });
//   }
// };

exports.findOne = async (req, res) => {
  const { movieId } = req.params; // Get the 'movieId' parameter from the URL
  console.log(movieId);
  
  try {
    // Use the 'findOne' method to retrieve a movie by movieId
    const movie = await Movie.findOne({ movieid: movieId });

    if (!movie) {
      // If movie is not found, send a 404 response
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Print the movieid to the console
    console.log('Movie ID:', movieId);

    // Send the movie details as JSON response (optional)
    res.json([movie]);
  } catch (err) {
    // Handle any errors that occur during the query
    console.error(err);
    res.status(500).json({
      message: 'Error retrieving movie',
      error: err,
    });
  }
};
// Function to find shows for a specific movie by ID
exports.findShows = async (req, res) => {
  const { movieId } = req.params; // Get the 'movieId' parameter from the URL

  try {
    // Use the 'findOne' method to retrieve a movie by movieId
    const movie = await Movie.findOne({ movieid: parseInt(movieId) });

    if (!movie) {
      // If movie is not found, send a 404 response
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Extract the "shows" field from the movie
    const shows = movie.shows;

    // Send the "shows" field as JSON response
    res.json({movies : shows});
  } catch (err) {
    // Handle any errors that occur during the query
    console.error(err);
    res.status(500).json({
      message: 'Error retrieving movie shows',
      error: err,
    });
  }
};