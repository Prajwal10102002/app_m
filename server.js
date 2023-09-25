const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/db.config'); // Import your models
const cors = require('cors');

///const router = express.Router();
const app = express();
app.use(cors());
const port = process.env.PORT || 8085;


// Middleware and route handling
const movieRoutes = require('./routes/movie.routes');
const genreRoutes = require('./routes/genre.routes');
const artistRoutes = require('./routes/artist.routes');
const userRoutes = require('./routes/user.routes');

// Add middleware for parsing JSON requests
app.use(express.json());

// Add your routes and other middleware here


// MongoDB connection setup
mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to the database!');
        // Start your Express app after connecting to the database

    })
    .catch((err) => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });

app.use('/api', movieRoutes); // Example base URL: http://localhost:3000/api/movies
app.use('/api', genreRoutes); // Example base URL: http://localhost:3000/api/genres
app.use('/api', artistRoutes); // Example base URL: http://localhost:3000/api/artists
app.use('/api', userRoutes);
app.get("/", (req, res) => {
    res.json({ message: "Movie booking application" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});