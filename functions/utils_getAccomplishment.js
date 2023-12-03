exports = async function(userId, goalId) {
  const cluster = context.services.get("mongodb-atlas");
  const accomplishments = cluster.db("poucouValley").collection("accomplishments");
  const query = { 'goalId': goalId, 'userId': userId };
	
	var accomplishment;
  await accomplishments.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found accomplishment: ${result}.`);
        accomplishment = result
      } else {
        console.log("No accomplishment matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find the accomplishment: ${err}`))
    
  return accomplishment;
};