exports = async function(){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("getStartedSteps");
  const query = { };
		
	var steps = [];
  await collection.find(query)
    .sort({ 'step': 1 })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        steps = result
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return { 'success': true, 'message': 'GET STARTED FETCHED', 'data': steps };
};