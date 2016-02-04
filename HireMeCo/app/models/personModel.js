// initialize the model
var mongoose = require('mongoose');
var db = mongoose.connection;

// define structure of the data
var personSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    // let's not think about this for a sec friends: [this] basically, store a list of other personSchemas
});

// creates a virtual property of the schema that uses already defined data
personSchema.virtual('fullname')
    .get(function () {
        return this.firstname + " " + this.lastname;
    });

// create the model (exports allows us to use it in other js files)
module.exports = mongoose.model('person', personSchema);

//sample using the model
//TODO: get back to this
/*
var Person = mongoose.model('person'); 
var samplePerson = new Person({
    firstname: 'Jarrett',
    lastname: 'Long',
    age: 22
});

samplePerson.friends.push(
    { firstname: 'Jack', lastname: 'Minogue', age: 22 }
);

samplePerson.save(function (err) {
    if (err) {
        console.log("There was an error adding friends.");
        console.log(err);
    } else {
        console.log('New friends array successfully saved');
    }
});
 */
