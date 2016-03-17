// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;
var Account = require('./account.js');
var JobModel = require('./job.js');

// represents an edge from job to job
var EdgeSchema = new mongoose.Schema({
    ComingFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Job'},
    PointsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    Score: Number
});

module.exports = mongoose.model('Edge', EdgeSchema);