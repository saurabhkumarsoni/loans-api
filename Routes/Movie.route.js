const express = require('express');
const router = express.Router();
const MovieController = require('../Controller/Movie.Controller')

const Movie = require("../Models/Movie.model");
const { verifyAccessToken, checkAdminRole } = require('../helpers/jwt_helper');

router.get('/highest-rated', MovieController.getHighestRated, MovieController.moviesList)

router.get('/',verifyAccessToken, MovieController.moviesList);

router.post('/',verifyAccessToken, MovieController.addMovie);

router.get('/:id', MovieController.findMovieById);

router.delete('/:id',checkAdminRole, verifyAccessToken, MovieController.deleteMovie);

router.patch('/:id', MovieController.updateMovie);




module.exports = router;