
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
        var secondIndex = 0;
        for (var index = 0; index < Second.length; index++) {
            if (Second[index].text == First[i].text) secondIndex = index;
        }
        var relevancy = Second.length - secondIndex;
        var idealRelevancy = First.length - i;
        DCG.push(new dcgItem(i + 1, First[i].text, relevancy, idealRelevancy));
    }
    console.log(DCG)
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


module.exports = function(First, Second) {
    skillScore = computeDCG(First.SkillList, Second.SkillList);
    surveyScore = computeDCG(Second.SurveyList, Second.SurveyList);
    console.log("Skill Score: " + skillScore);
    console.log("Survey Score: " + surveyScore);
    return Math.round(((skillScore + surveyScore) / 2) * 100);
}