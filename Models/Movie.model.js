const { string } = require("@hapi/joi");
const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const fs = require('fs');
const validator = require('validator')

const MovieSchema = new Scheme({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    unique: true,
    trim: true,
    validate: [validator.isAlpha, 'Name should only Alphabets']
  },
  description: {
    type: String,
    required: [true, "Description is required field!"],
    trim: true,
  },
  runtime: {
    type: Number,
    require: [true, "Runtime is required field"],
  },
  director: {
    type: String,
    require: [true, "Director is required filed!"],
  },
  actor: {
    type: String,
    require: [true, "Actor is required filed!"],
  },
  posterUrl: {
    type: String,
    require: [true, "Actor is required filed!"],
  },
  releaseYear: { type: Number},
  ratings: { type: Number},
  totalRatings: { type: Number},
  releaseDate: {
    type: Date
  },
  createdAt: {
    type: Date, 
    default: Date.now(),
    select: false
  },
  genres: {
    type: [String],
    required: [true, 'Genres is required field!']
  },
  price: {
    type: Number,
    required: [true, 'Price is required field!']
  },
  createdBy: String

}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

// EXECUTED BEFORE THE DOCUMENT IS SAVED IN DB
//.save() or .create()
//insertMany, findByIdAndUpdate will not work 
MovieSchema.pre("save", async function (next) {
  try {
    this.createdBy = "saurabh";
  } catch (error) {
    next(error);
  }
});

MovieSchema.post("save", async function (doc, next) {
  const content = `A new movie document with name ${doc.name} had been created by ${doc.createdBy}\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (error) => {
    if (error) {
      console.error(error.message);
    }
  });
  next(); 
});

MovieSchema.pre(/^find/, async function(next) {
  this.find({releaseDate: {$lte: Date.now()}});
  next();
})


MovieSchema.virtual('runtimeInHours').get(function(){
  return this.runtime / 60;
})


const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
