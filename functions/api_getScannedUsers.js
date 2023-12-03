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
  
  // get scanned cards
  const cluster = context.services.get("mongodb-atlas");
  const scanRecordsCollection = cluster.db("poucouValley").collection("scanRecords");
  const pipeline = [
  { "$match": {
      "merchantUserId": merchantId
    }
  },
  { "$group": {
      "_id": "$cardNumber"
    } 
  }
  ];
	var cardNumbers = [];
  await scanRecordsCollection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cards: ${result}.`);
        for (const card of result) {
          cardNumbers.push(card._id);
        }
      } else {
        console.log("No cards matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
  
  // get cardholder info of scanned cards
  const cardholdersCollection = cluster.db("poucouValley").collection("cardholders");
  const pipeline2 = [
  { "$match": {
      "card": { '$in': cardNumbers }
    }
  }
  ];
  var cardHolders = [];
  await cardholdersCollection.aggregate(pipeline2)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholders: ${JSON.stringify(result)}.`);
        cardHolders = result
      } else {
        console.log("No cardholders matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  return { 'success': true, 'message': "SUCCESS", 'data': cardHolders };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d')