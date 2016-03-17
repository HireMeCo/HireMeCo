"use strict";

// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;

// define structure of the Mongo data
var JobSchema = new mongoose.Schema({

    JobTitle: String,
    Company: String,
    Description: String,
    SkillList: [String],
    SurveyList: [String],
    AdjacentJobIds: [String],
    Index: Number

});

// Provides all of the functions necessary to communicate with the database
var JobModel = mongoose.model('Job', JobSchema);

// Log to the console for sanity
db.on('error', console.error.bind(console, "connection error in jobModel.js"));
db.once('open', function () {
    console.log("JobDB is open...");
});


// Grab ALL jobs (no A Star)
exports.getAllJobs = function (request, response) {

    JobModel.find().exec(function (err, res) {
        if (err) {
            response.status(500).json({ error: err });
        }
        else {
            console.log("Fetched Jobs from API call.")
            response.statuc(200).send(res);
        }
    });
};

exports.add = function (request, response) {

    console.log("Entered the job model api.");
    console.log("Coming from the request: ");
    console.log("jobtitle: " + request.body.JobTitle);
    console.log("company: " + request.body.Company);
    console.log("skilllist: " + request.body.SkillList);
    console.log("surveylist: " + request.body.SurveyList);

    // Create new JobObject
    var newjob = new JobObject(
        request.body.JobTitle,
        request.body.Company,
        request.body.Description,
        request.body.SkillList,
        request.body.SurveyList,
        [], // empty list of AdjacentJobIds
        0   // empty index number
        );

        // In the case this is the first job posting...
    JobModel.count({ 'Index': 1 }, function (err, count) {
        if (err) {
            console.log('Trouble Counting');
            response.status(500).json({ error: 'Trouble Counting.' });
        } else if (count == 0 || count == null) {
            console.log("Counted " + count.toString() + "of these in the db.");
            console.log("No jobs in database, adding first.");
            newjob.Index = 1;
            JobModel.create(newjob, function (addError, job) {
                if (addError) {
                    console.log("Error adding first job to database: " + addError);
                    response.status(500).json({ error: addError });
                } else {
                    console.log("Successfully added first job to database :)");
                    response.status(200).json({ status: 'Job Posting Success!' });
                }
            });
        }
        else{
            console.log("Finding adjacent jobs...");
            JobModel.findOne({ 'Index': 1 }, function (err, firstJob){
            if (err)
            {  // Error check
                console.log("Error finding start job node.");
                console.log("err: " + err);
                console.log("firstJob" + firstJob);
                response.status(500).json({ error: err });
            }
            else
            {  // Calculate the difference similarity root job and newjob
                console.log("jobModel.js: calculating adjacency information!")
                var skillDiff = ListDiff(newjob.SkillList, firstJob.SkillList);
                var surveyDiff = ListDiff(newjob.SurveyList, firstJob.SurveyList);
                if (skillDiff + surveyDiff <= 2)
                {   //update start nodes adjacencies
                    JobModel.update({ Index: 1 }, { $push: { AdjacentJobIds: firstJob.id.valueOf() } });
                    newjob.AdjacentJobIds.push(firstJob.id.valueOf());
                }

                // RECURSIVE CALL TO SET ALL ADJACANT JOBS
                console.log("Begin Recursive Stuff");
                recurseAdjacencies(firstJob, newjob, [firstJob.id.valueOf]);

                //add new job to database
                JobModel.create(newjob, function (addError, job)
                {
                    if (addError)
                    {
                        console.log("Error adding first job to database.");
                        response.status(500).json({ error: addError });
                    }
                    else
                    {
                        response.status(200).json({ status: 'Successfully posted job!'})
                    }
                });
            }
        });
        }
    });

    // takes two JobObjects and a list of ids to track previousy inspected items
    function recurseAdjacencies(startjob, newjob, markedIds)
    {
        startjob.AdjacentJobIds.forEach(function(adj)
        {
            if (markedIds.indexOf(adj) > -1)
            { // if we're already inspected the adjacency, don't bother
                return;
            }

            markedIds.push(adj);

            JobModel.findOne({ _id: adj }, 'SkillList SurveyList', function(err, aJob)
            { // find adjacent job
                if (err)
                {
                    console.log("Error finding start job node.");
                    response.status(500).json({ erro: err });
                }
                else
                {  // add to adjacency if they are related
                    console.log("Comparing skill diffs and survey diffs");
                    var skillDiff = ListDiff(aJob.SkillList, newjob.SkillList);
                    var surveyDiff = ListDiff(aJob.SurveyList, newjob.SurveyList);
                    if (skillDiff + surveyDiff <= 2)
                    {
                        JobModel.update({ _id: adj }, { $push: { AdjacentJobIds: newjob.id.valueOf() } }); newjob.AdjacentJobIds.push(aJob.id.valueOf());
                        recurseAdjacencies(aJob, newjob);
                    }
                }
             });
        });
    }
    function ListDiff(First, Second) {
        var Same = 0;
        var Max = Math.max(First.length, Second.length);

        //loop through list of sortables. Example: ( { text: "JavaScript" } )
        First.forEach(function (item) {
            Second.forEach(function (secondItem) {
                if (item.Value == secondItem.Value) {
                    Same += 1;
                }
            });
        });
        return Max - Same;
    }
};



// Just a helper method that returns an object with all the necessary fields
var JobObject = function (JobTitle, Company, Description, SkillList, SurveyList, AdjacentJobIds, Index)
{
    this.JobTitle = JobTitle;
    this.Company = Company;
    this.Description = Description;
    this.SkillList = SkillList;
    this.SurveyList = SurveyList;
    this.AdjacentJobIds = AdjacentJobIds;
    this.Index = Index;
}


// The object that is used to create the heap and will eventually be returned
var AStarNode = function(StarNode, g, h, Parent)
{
    this.JobNode = JobObject;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.Parent = Parent;
}

// returns a score for how well two lists match
var SkillHeuristic = function(First, Second)
{
    var Score = 0,
        IsMatch = false,
        MatchList = [];

    for (i = 0; i < First.length; i++)
    { // loop throught the first list...
        for(j = 0; i < Second.length; j++)
        { // loop throught the seccond
			if(First[i] == Second[j])
            {  // if the two match, get abs value
                var Num = Math.abs(i - j);
				Score += Num * Num;
				IsMatch = true;
				MatchList[j] = true;
				break;
			}
		}
        // if no matchs in the first loop, increase score
		if(IsMatch == false)
        { // why
			var Num = First.length - i;
			Score += Num * Num;
        }
        else
        { // why
            IsMatch = false;
        }

    }
    for(var i = 0; i < Second.length; i++)
    { // loop through the second list and increase score if no matches
        if(MatchList[i] == false)
        { // why David, why
            var Num = Second.length - i;
            Score += Num * Num;
        }
    }
	return Score;
}

// returns an AStarNode of scores (nodes) in reverse so that the most relevant job to the jobseeker
// the RootJob is job where index equal 1
// the JobSeeker is the person whose jobs we're trying to match
var AStar = function(RootJob, JobSeeker, Heuristic)
{
    var AlreadyVisited = [];
    var OpenHeap = new Heap(true);
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
        for (i = 0; i < CurrentNode.JobNode.AdjacentJobIds.length; i++)
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

// exports.modify = function (request, response) {
//
//     var employeeId = request.params.employeeId;
//
//     JobModel.update(
//         { _id: employeeId },
//         {
//             firstname: request.body.firstname,
//             lastname: request.body.lastname,
//             age: request.body.age,
//             email: request.body.email
//         },
//         { multi: false },
//         function (error, rowsAffected) {
//             if (error) {
//                 console.log("Error updating employee (job seeker) data")
//                 response.send(500, { error: error });
//             }
//             else if (rowsAffected == 0) {
//                 response.send(500, { error: "No employees match id: " + employeeId });
//             }
//             else {
//                 response.send(200);
//             }
//         }
//     );
// };