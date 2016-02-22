var mongoose = require('mongoose');
var db = mongoose.connection;

// define the structure of the model
var movieSchema = mongoose.Schema({
    name: String,
    released: Boolean,
    watched: Boolean
});

var MovieModel = mongoose.model('movie', movieSchema);

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    console.log("moviesDb is open...");
    
    MovieModel.find().exec(function (error, results) {
        if (results.length === 0) {
            console.log("Fetched Movies")
            MovieModel.create({ name: "This means there was nothing in the db", released: false, watched: true });
        }
    });
});

exports.fetch = function (request, response) {
    MovieModel.find().exec(function (err, res) {
        if (err) {
            response.send(500, { error: err });
        }
        else {
            console.log("Fetched Movies from API call.")
            response.send(res);
        }
    });
};

exports.add = function (request, response) {
    var newMovie = { name: request.body.name, released: false, watched: false };
    MovieModel.create(newMovie, function (addError, addedMovie) {
        if (addError) {
            response.send(500, { error: addError });
        }
        else {
            response.send({ success: true, movie: addedMovie });
        }
    });
};

exports.modify = function (request, response) {
    var movieId = request.params.movieId;
    MovieModel.update({ _id: movieId }, { released: request.body.released, watched: request.body.watched }, { multi: false },
        function (error, rowsAffected) {
        if (error) {
            response.send(500, { error: error });
        }
        else if (rowsAffected == 0) {
            response.send(500, { error: "No rows affected" });
        }
        else {
            response.send(200);
        }
    }
    );
};