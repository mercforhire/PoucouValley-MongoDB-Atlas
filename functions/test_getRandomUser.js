exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("users");
  const pipeline = [
    { "$sample": 
      { 
        size: 1 
      }
    }
  ];
		
	var user;
	await collection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found user: ${result}.`);
        user = result[0];
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return user;
};

//exports()