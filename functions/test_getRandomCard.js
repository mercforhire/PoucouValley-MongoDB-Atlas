exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("cards");
  const pipeline = [
    { "$sample": 
      { 
        size: 1 
      }
    }
  ];
		
	var card;
	await collection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found card: ${result}.`);
        card = result[0];
      } else {
        console.log("No card matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return card;
};

//exports()