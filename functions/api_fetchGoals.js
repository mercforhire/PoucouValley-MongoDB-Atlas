exports = async function(){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("goals");
  const query = { };
		
	var goals = [];
  await collection.find(query)
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        goals = result
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return { 'success': true, 'message': 'GOALS FETCHED', 'data': goals };
};