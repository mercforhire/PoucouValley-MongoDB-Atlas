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
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // extract the card numbers belonging to the merchant
  var cardNumbers = [];
  if (merchant.cards == null) {
    return { 'success': true, 'message': "SUCCESS", 'data': [] };
  }
  
  for (const card of merchant.cards) {
    cardNumbers.push(card.number);
  }
  
  // for each card belonging to the merchant, check for corresponding cardholder
  const cluster = context.services.get("mongodb-atlas");
  const cardholdersCollection = cluster.db("poucouValley").collection("cardholders");
  const pipeline = [
  { "$match": {
      "card": { '$in': cardNumbers }
    }
  }
  ];
  var cardholderUserIds = [];
  await cardholdersCollection.aggregate(pipeline)
	  .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholders: ${JSON.stringify(result)}.`);
        for (const record of result) {
          cardholderUserIds.push(record.userId);
        }
      } else {
        console.log("No cardholders matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  // get clients of activated cardholders
  const clientsCollection = cluster.db("poucouValley").collection("clients");
  const pipeline2 = [
    { 
      "$match": {
        "ownerId": { '$eq': merchantId }
      }
    },
    { 
      "$match": {
        "cardholderUserId": { '$in': cardholderUserIds }
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