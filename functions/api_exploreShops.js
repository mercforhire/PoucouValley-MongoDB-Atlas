exports = async function(apiKey, { category } ){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  var merchantsCollection = cluster.db("poucouValley").collection("merchants");
  var pipeline = [
    { "$sample": 
      { 
        size: 50 
      }
    }
  ];
  
  if (category != undefined && category) {
    const match = {
      '$match': {
        'field': category
      }
    };
    pipeline.unshift(match);
  }
		
	var merchants = [];
	await merchantsCollection.aggregate(pipeline)
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found merchants: ${result}.`);
        merchants = result
      } else {
        console.log("No merchants matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  for (const merchant of merchants) {
    const numberOfVisitsResult = await context.functions.execute("utils_getNumberOfVisits", merchant.userId);
    if (numberOfVisitsResult.data) {
      merchant.visits = numberOfVisitsResult.data;
    }
    
    const numberOfFollowersResult = await context.functions.execute("utils_getNumberOfFollowers", merchant.userId);
    if (numberOfFollowersResult.data) {
      merchant.followers = numberOfFollowersResult.data;
    }
  }
    
  return { 'success': true, 'message': "SUCCESS", 'data': merchants };
};

//exports('Sport & Health')