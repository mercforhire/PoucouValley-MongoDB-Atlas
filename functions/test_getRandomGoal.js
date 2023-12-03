exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("goals");
  const pipeline = [
    { "$sample": 
      { 
        size: 1 
      }
    }
  ];
		
	var goal;
	await collection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholder: ${result}.`);
        goal = result[0];
      } else {
        console.log("No cardholder matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return goal;
};

//exports()