exports = async function(apiKey) {
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("cards");
  const query = {
    'associatedMerchant': merchantId
  };
		
	var cards = [];
	await collection.find(query)
	  .sort({ number: 1 })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found cards: ${result}.`);
        cards = result
      } else {
        console.log("No cards matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
    
  for (const card of cards) {
    if (card.associatedMerchant) {
      var merchant = await context.functions.execute("utils_getMerchantById", card.associatedMerchant);
      card.associatedMerchant = merchant;
    }
    if (card.associatedCardholder) {
      var cardholder = await context.functions.execute("utils_getCardholderById", card.associatedCardholder);
      card.associatedCardholder = cardholder;
    }
  }
  
  return { 'success': true, 'message': "api_getMerchantCards SUCCESS", 'data': cards };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d')