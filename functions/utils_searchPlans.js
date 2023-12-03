exports = async function(keyword) {
  const cluster = context.services.get("mongodb-atlas");
  const plans = cluster.db("poucouValley").collection("plans");
  const query = { "title": { '$regex': keyword, $options: 'i' } };
	const query2 = { "description": { '$regex': keyword, $options: 'i' } };
	
	var results;
  await plans.find({ $or: [ query, query2 ] })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found plans: ${result}.`);
        results = result
      } else {
        console.log("No plan matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find the plan: ${err}`))
    
  return results;
};