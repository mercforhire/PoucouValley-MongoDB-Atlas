exports = async function(apiKey) {
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
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
  
  // get cardholder info of following users
  const cardholdersCollection = cluster.db("poucouValley").collection("cardholders");
  const pipeline2 = [
  { "$match": {
      "userId": { '$in': followingUserIds }
    }
  }
  ];
  var cardHolders = [];
  await cardholdersCollection.aggregate(pipeline2)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholders: ${result}.`);
        cardHolders = result
      } else {
        console.log("No cardholders matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return { 'success': true, 'message': "SUCCESS", 'data': cardHolders };
};

//exports('c061c8696ecd3ee3b8602f228cade15554699a57a7c603b90c2b6baa90bfb3a2770b9527e7bdbb28c92661a9953bf79814aaaf1244b45f473754fa71b36a4ebb'))