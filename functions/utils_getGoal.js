exports = async function(goalId) {
  const cluster = context.services.get("mongodb-atlas");
  const goals = cluster.db("poucouValley").collection("goals");
  const query = { '_id': goalId };
	
	var goal;
  await goals.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found goal: ${result}.`);
        goal = result
      } else {
        console.log("No goal matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find the item: ${err}`))
    
  return goal;
};

//exports('1234567890')