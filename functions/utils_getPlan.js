exports = async function(planId){
  const cluster = context.services.get("mongodb-atlas");
  const plans = cluster.db("poucouValley").collection("plans");
  const query = { '_id': planId };
		
	var plan;
  await plans.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found plan: ${result}.`);
        plan = result
      } else {
        console.log("No plan matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return plan;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))