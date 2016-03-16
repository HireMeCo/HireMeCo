// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;
var Account = require('./account.js');
var JobModel = require('./job.js');
var EdgeModel = require('./edge.js');

var Skill = function(name, relevancy) {
    this.name == name;
    this.relevancy = relevancy;
}

var AddJob = function(SkillList) {
    for (var i = 0; i < SkillList.Length; i++){
        Job.Set.push(new Skill(SkillList[i], i));
    }
}

var Find = function(SkillList) {
    var matches = [];
    var stop = false;
    while (matches.length < 10 || stop == false) {
        JobModel.find.where(Set == Seeker.Set).exec(function(results) {

        });
        stop = true;
    }
}

// Log to the console for sanity
db.on('error', console.error.bind(console, "connection error in jobModel.js"));
db.once('open', function() { console.log("JobDB is open..."); });

var handleError = function(err, response) {
    console.log(err);
    response.status(500).json({ error: 'Trouble in paradise. Check console.' });
}

exports.handleError = handleError;

var returnJob = function(newjob, edge, response) {
    console.log("Inserted new job: " + newjob);
    response.status(200).json({
        status: 'Job Posting Success!',
        job: newjob.JobTitle,
        connectedto: edge
    });
}

//====================== HELPER METHODS =============================
var dcgItem = function(rank, value, relevancy, idealRelevancy, dcgval, ndcgval) {
    this.rank = rank;
    this.value = value;
    this.relevancy = relevancy;
    this.idealRelevancy = idealRelevancy;
    this.dcgval = dcgval;
    this.ndcgval = ndcgval;
}

var computeDCG = function(First, Second) {
    // ==== DCG similarity heuristic ===

    // construct list of dcg items with their relevancy
    var DCG = [];
    for (var i = 0; i < First.length; i++){
        var relevancy = Second.length - Second.indexOf(First[i]);
        var idealRelevancy = First.length - i;
        DCG.push(new dcgItem(i + 1, First[i], relevancy, idealRelevancy));
    }
    //perform DCG heuristic
    var rel1 = DCG[0].relevancy;
    var idealRel1 = DCG[0].idealRelevancy;
    var avgDCG = 0;
    var navgDCG = 0;
    for (var i = 0; i < DCG.length; i++){
        var dcg = 0;
        var ndcg = 0;
        for (var j = 1; j <= i; j++){
            dcg += (DCG[i].relevancy / (Math.log(j + 1) / Math.log(2)));
            ndcg += (DCG[i].idealRelevancy / (Math.log(j + 1) / Math.log(2)))
        }
        DCG[i].dcgval = rel1 + dcg;
        DCG[i].ndcgval = idealRel1 + ndcg;
        avgDCG += DCG[i].dcgval;
        navgDCG += DCG[i].ndcgval;
    }
    avgDCG = avgDCG / DCG.length;
    navgDCG = navgDCG / DCG.length;
    return avgDCG / navgDCG; // this is how well First Matches to Second.
}

// see https://en.wikipedia.org/wiki/Discounted_cumulative_gain
// returns a score for how well two lists match
var Heuristic = function(First, Second) {
    skillScore = computeDCG(First.SkillList, Second.SkillList);
    surveyScore = computeDCG(Second.SurveyList, Second.SurveyList);
    console.log("Skill Score: " + skillScore);
    console.log("Survey Score: " + surveyScore);
    return (skillScore + surveyScore) / 2;
}

exports.Heuristic = Heuristic;

var AddConnection = function(newjob, bestMatch, score, request, response) {
    var newEdge1 = new EdgeModel({
        ComingFrom: bestMatch._id,
        PointsTo: newjob._id,
        Score: score
    });
    var newEdge2 = new EdgeModel({
        ComingFrom: newjob._id,
        PointsTo: bestMatch._id,
        Score: score
    });

    newEdge1.save(function(err) {
        if (err) handleError(err, response);
        newEdge2.save(function(err) {
            if (err) handleError(err, response);
            returnJob(newjob, newEdge2, response);
        });
    });
}

// inserts job and updates adjacencies
var InsertJob = function(newjob, parent, visited, request, response) {

    var scoreToParent = Heuristic(newjob, parent);
    console.log("Currently on " + parent.JobTitle);
    console.log("Score from " + newjob.JobTitle + " to " + parent.JobTitle + ": " + scoreToParent);

    EdgeModel
        .find({ ComingFrom: parent._id })
        .populate('PointsTo')
        .exec(function(err, edges) {
            if (err) handleError(err, response);
            if (!edges) {
                console.log("Reached a leaf, add adjacent job to: " + parent.JobTitle);
                AddConnection(newjob, parent, scoreToParent, request, response);
            }
            else {
                var max = scoreToParent;//Heuristic(newjob, adjacencies[0]);
                var bestMatch = parent;
                console.log("Visiting adjacencies...");
                edges.forEach(function(edge) {
                    var score = Heuristic(newjob, edge.PointsTo);

                    console.log("Looking at " + edge.PointsTo._id);
                    if (score >= max && visited.indexOf(edge.PointsTo.id) == -1) {
                        max = score;
                        bestMatch = edge.PointsTo;
                    }
                });
                // if after checking all the adjacencies the current job is still the best..
                if (bestMatch == parent) {
                    AddConnection(newjob, parent, max, request, response);
                } else {
                    visited.push(parent.id); // to make sure we don't get an infinite recursion...
                    InsertJob(newjob, bestMatch, visited, request, response);
                }
            }
        });
}

//updates the associated account
var UpdateAccount = function(accountId, jobId, response) {
    Account.findOne({ id: accountId }, function(err, account) {
        if (err) handleError(err, response);
        account.jobs.push(jobId);
        Account.save(function(err) { if (err) handleError(err, response); });
    });
}

//============================= ADD JOB =============================
// adds the job with the appropriate references
exports.add = function (request, response) {

    //add the new job to the database
    var newjob = new JobModel({
        JobTitle: request.body.JobTitle,
        Description: request.body.Description,
        SkillList: request.body.SkillList,
        SurveyList: request.body.SurveyList
    });

    console.log("Adding new job: " + newjob.JobTitle);

    //inserts job, handling case that it's the first job
    JobModel.findOne({ Root: true }, function(err, root) {
        if (err) handleError(err, response);
        if (root == null) {
            newjob.Root = true;
            newjob.save(function(err) {
                if (err) handleError(err, response);
                //updateAccount(request.body.account.id, newjob.id);
                returnJob(newjob, null, response);
            });
        } else {
            newjob.save(function(err) {
                if (err) handleError(err, response);
                var visited = [];
                InsertJob(newjob, root, visited, request, response);
            });
        }
    });
};

// Grab ALL jobs (no A Star) worry about this in a sec
exports.getAllJobs = function (request, response) {

    JobModel.find().exec(function (err, res) {
        if (err) {
            console.log(err);
            response.status(500).json({ error: err });
        }
        else {
            console.log("Fetched All Jobs from API call.")
            response.status(200).send(res);
        }
    });
};

var Result = function(job, score) {
    this.job = job;
    this.score = score;
}
exports.ResultItem = Result;

exports.matchSeeker = function(request, response) {
    Account.findOne({ id: request.body.Account.id }, function(err, seeker) {
        if (err) handleError(err, response);
        results = [];
        JobModel.find().exec(function(err, jobs) {
            if (err) handleError(err, response);
            jobs.forEach(function(job) {
                results.push(new Result(job, Heuristic(seeker, job)));
            });
            results.sort(function(a, b) {
                b.score - a.score;
            });
            seeker.MatchedJobs.$set(results);
            response.status(200).json({
                status: "Returning matches :)",
                matches: results
            });
        });
    });
}



// Just a helper method that returns an object with all the necessary fields
var JobObject = function (JobTitle, Company, Description, SkillList, SurveyList, AdjacentJobIds, Index){
    this.JobTitle = JobTitle;
    this.Company = Company;
    this.Description = Description;
    this.SkillList = SkillList;
    this.SurveyList = SurveyList;
    this.AdjacentJobIds = AdjacentJobIds;
    this.Index = Index;
}


// The object that is used to create the heap and will eventually be returned
var AStarNode = function(StarNode, g, h, Parent){
    this.JobNode = JobObject;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.Parent = Parent;
}


// returns an AStarNode of scores (nodes) in reverse so that the most relevant job to the jobseeker
// the RootJob is job where index equal 1
// the JobSeeker is the person whose jobs we're trying to match
var AStar = function(RootJob, JobSeeker)
{
    var AlreadyVisited = [];
    var OpenHeap = new Heap(false); //max sorted heap
    var OpenArray = [];
	var BestNode = null;
    var CurrentNode = null;

    BestNode = new AStarNode(RootJob, 0, Heuristic(RootJob, JobSeeker), null);

    OpenHeap.insert(BestNode, BestNode.f);
    OpenArray.push(BestNode);

    while (OpenHeap.size() > 0)
    {
        CurrentNode = OpenHeap.pop();
        if (BestNode.f > CurrentNode.f) BestNode = CurrentNode;

        // check if current node is perfect match.  if so, then stop the while loop
        if (CurrentNode.JobNode.SkillList.length == JobSeeker.SkillList.length &&
            SkillHeuristic(CurrentNode.JobNode.SkillList, JobSeeker.SkillList) == 0){
            break;
        }

        //
        for (var i = 0; i < CurrentNode.JobNode.AdjacentJobIds.length; i++)
        {
            var AdjacentJob = new JobObject;
            var ID = CurrentNode.JobNode.AdjacentJobId[i];
            JobModel.findOne({ _id: ID }, function(err, jobe){
                if(err){
                    console.log("There was an error getting adj job: " + adj.toString());
                }
                else{
                    AdjacentJob.JobTitle = jobe.JobTitle;
                    AdjacentJob.Company = jobe.Company;
                    AdjacentJob.Description = jobe.Description;
                    AdjacentJob.SkillList = jobe.SkillList;
                    AdjacentJob.SurveyList = jobe.SurveyList;
                    AdjacentJob.AdjacentJobIds = jobe.AdjacentJobIds;

                    // Celebrate success
                    console.log("Successfully got ", jobe.JobTitle, " from the database.");
                }
            });
            // if this adjacent job has not yet been inspected...
            var skipInsert = false;
            if (!(AlreadyVisited.indexOf(AdjacentJob) > -1)){
                for(var starNode in OpenArray){
                    if(starNode.JobNode == AdjacentJob) {
                        var gCost = CurrentNode.g + Heuristic(Node.Node, CurrentNode.JobNode.AdjacentJobIds[i]);
                        if(gCost < starNode.g) {
                            starNode.g = gCost;
                            //BinaryHeap as no function to increase a node's value so I'm reinserting it.
                            OpenHeap.remove(starNode);
				            OpenHeap.insert(starNode, starNode.f);
                            OpenArray.push( starNode );

                        }
                        skipInsert = true;
                    }
                }
            }
            if(skipInsert)
            { // Insert Adjacent Job onto the heap, with currentnode as parent
                var newNode = new AStarNode(AdjacentJob, CurrentNode.g + 1, SkillHeuristic(CurrentNode.JobNode.SkillList,JobSeeker.SkillList), CurrentNode);
                OpenHeap.insert( newNode, CurrentNode.f );
                OpenArray.push( newNode );
            }
        }
        // push to AlreadyVisited bc we've looked at it
        AlreadyVisited.push(CurrentNode.JobNode);
    }
    return BestNode;
}
