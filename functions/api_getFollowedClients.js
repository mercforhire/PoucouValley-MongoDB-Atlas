exports = async function(apiKey){
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // get follower records
  const cluster = context.services.get("mongodb-atlas");
  const followRecordsCollection = cluster.db("poucouValley").collection("followRecords");
  const pipeline = [
  { "$match": {
      "merchantUserId": merchantId
    }
  }
  ];
  
	var followingUserIds = [];
  await followRecordsCollection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found follow records: ${result}.`);
        for (const record of result) {
          followingUserIds.push(record.userId);
        }
      } else {
        console.log("No records matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  // get clients of scanned cardholders
  const clientsCollection = cluster.db("poucouValley").collection("clients");
  const pipeline2 = [
    { 
      "$match": {
        "ownerId": { '$eq': merchantId }
      }
    },
    { 
      "$match": {
        "cardholderUserId": { '$in': followingUserIds }
      }
    }
  ];
  var clients = [];
  await clientsCollection.aggregate(pipeline2)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found clients: ${result}.`);
        clients = result
      } else {
        console.log("No clients matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return { 'success': true, 'message': "SUCCESS", 'data': clients };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d')