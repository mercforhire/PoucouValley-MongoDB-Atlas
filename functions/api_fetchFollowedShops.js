exports = async function(apiKey) {
 // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const followRecords = cluster.db("poucouValley").collection("followRecords");
  const pipeline = [
    { "$match":
     {
       'userId': userId
     }
    }
  ];
  
  var merchantIds = [];
	await followRecords.aggregate(pipeline)
    .toArray()
    .then(result => {
      console.log(`Successfully query follow records.`)
      for (const merchant of result) {
        merchantIds.push(merchant.merchantUserId);
      }
    })
    .catch(err => console.error(`Failed to query follow records: ${err}`))
    
  const merchantsCollection = cluster.db("poucouValley").collection("merchants");
  const pipeline2 = [
    { "$match": {
        "userId": { '$in': merchantIds }
      }
    }
  ];
  var merchants = [];
	await merchantsCollection.aggregate(pipeline2)
    .toArray()
    .then(result => {
      console.log(`Successfully query merchants.`)
      merchants = result;
    })
    .catch(err => console.error(`Failed to query merchants: ${err}`))
    
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

//exports(new BSON.ObjectId('6274797d50ac436de2d2c1a4'))