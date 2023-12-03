exports = async function(maxNumberOfResults) {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("gifts");
  var pipeline = []
  
  if (maxNumberOfResults != null) {
    pipeline = [
      { "$sample": 
        { 
          size: maxNumberOfResults
        }
      }
    ];
  }
	
	await collection.aggregate(pipeline)
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found gifts: ${result}.`);
        results = result
      } else {
        console.log("No gifts matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query gifts: ${err}`));
    
  return { 'success': true, 'message': "GIFTS_FETCHED", 'data': results };
};
