exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("clients");
  const pipeline = [
    { "$sample": 
      { 
        size: 1 
      }
    }
  ];
		
	var client;
	await collection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found client: ${result}.`);
        client = result[0];
      } else {
        console.log("No client matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return client;
};

//exports()