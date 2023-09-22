const express = require('express');
const router = express.Router();
const MovieController = require('../Controller/Movie.Controller')

const Movie = require("../Models/Movie.model");
const { verifyAccessToken } = require('../helpers/jwt_helper');
const checkUserRole = require('../helpers/checkUserRole');
const userRoles = require("../helpers/userRoles");

router.get('/highest-rated', MovieController.getHighestRated, MovieController.moviesList)

router.get('/',verifyAccessToken, MovieController.moviesList);

router.post('/',verifyAccessToken, MovieController.addMovie);

router.get('/:id', MovieController.findMovieById);

router.delete('/:id', verifyAccessToken, (req, res, next) => checkUserRole(userRoles.admin)(req, res, next), MovieController.deleteMovie);

router.patch('/:id', MovieController.updateMovie);





module.exports = router