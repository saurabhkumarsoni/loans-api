const createError = require("http-errors");
const Movie = require("../Models/Movie.model");
const ApiFeatures = require("../Utils/ApiFeatures");

module.exports = {
  moviesList: async (req, res, next) => {
    try {
      const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      let movies = await features.query;
      res.status(200).json({
        status: "success",
        length: movies.length,
        data: { movies },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  addMovie: async (req, res, next) => {
    console.log("Movie BODY", req.body);
    try {
      const movie = new Movie(req.body);
      console.log("customer", movie);
      const result = await movie.save();
      res.send(result);
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findMovieById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw createError(404, "Movie does not exist.");
      }
      res.send(movie);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Movie id"));
      } else {
        next(error);
      }
    }
  },

  deleteMovie: async (req, res, next) => {
    console.log('delete movie req', req)
    const id = req.params.id;
    try {
  
      const result = await Movie.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Movie does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Movie id"));
      } else {
        next(error);
      }
    }
  },

  updateMovie: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const result = await Movie.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, "Movie does not exist.");
      }
      res.send(result);
    } catch (error) {
      if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
        next(createError.BadRequest("Invalid Customer id"));
      } else {
        next(error);
      }
    }
  },

  getHighestRated: async (req, res, next) => {
    req.query.limit = "10";
    req.query.sort = "-ratings";

    next();
  },
};


