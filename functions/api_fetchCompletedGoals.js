exports = async function(apiKey){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': null };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("accomplishments");
  const query = { 'userId': userId };
		
	var goalObjectIds = [];
  await collection.find(query)
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        for (const object of result) {
          goalObjectIds.push(object.goalId);
        }
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
  
  var completedGoals = [];
  for (const goalObjectId of goalObjectIds) {
    const goal = await context.functions.execute("utils_getGoal", goalObjectId);
    completedGoals.push(goal);
  }
  
  return { 'success': true, 'message': 'GOALS FETCHED', 'data': completedGoals };
};
 