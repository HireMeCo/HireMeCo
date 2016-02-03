// this is for server-side routing 
//   (api calls, or anything you don't want the user to nav to)
// routes is in the app folder so when you require stuff it can use
//   relative paths to find the file

// need path to route to public html files correctly
var path = require("path");

// setup models
var Person = require('./models/personModel.js');
var Movie = require('./models/movieModel.js');

module.exports = function (app) {
    // get shit
    app.get('/api/people', function (request, response) {
        //use mongoose to get all people in database
        Person.find(function (err, people) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(people); // send back all person data in json
            }
        });
    });

    // create shit
    
    // delete shit

    // old
    app.get('/api/movies', Movie.fetch);
    
    app.post('/api/movies', Movie.add);
    
    app.put('/api/movies/:movieId', Movie.modify);

    // frontend routes (this is for a single page application,
    // so everything routes to the main page)
    //this should be in the angular routes i think
    app.get('*', function (request, response) {
        response.sendFile(path.join(__dirname, '../public', '/views/index.html'));
        //these two do the same thing
        //response.sendFile('index1.html', { root: path.join(__dirname, '../public') });
        // ^^ this one is more secure, apparently
    });

};
