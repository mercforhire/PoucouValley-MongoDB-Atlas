exports = async function(apiKey){
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': userId };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantByID", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // extract the card numbers belonging to the merchant
  var cardNumbers = [];
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
  var cardHolders = [];
  await cardholdersCollection.aggregate(pipeline)
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

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'))