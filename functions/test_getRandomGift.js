exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("gifts");
  const pipeline = [
    { "$sample": 
      { 
        size: 1 
      }
    }
  ];
		
	var gift;
	await collection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found gift: ${result}.`);
        gift = result[0];
      } else {
        console.log("No gift matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return gift;
};

//exports()