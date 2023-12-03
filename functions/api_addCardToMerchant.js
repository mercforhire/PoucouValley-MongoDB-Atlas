exports = async function(apiKey, { cardNumber }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check merchant exist
  var merchant = await context.functions.execute("utils_getMerchantById", userId);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_NOT_FOUND', 'data': null };
  }
  
  // check card number and pin 
  const card = await context.functions.execute("utils_getCardByNumber", cardNumber);
  if (!card) {
    return { 'success': false, 'message': 'CARD_NOT_EXIST', 'data': null };
  }
  
  // check card is not used by another merchant
  if (card.associatedMerchant) {
    return { 'success': false, 'message': 'CARD_ALREADY_OWNED_BY_ANOTHER_MERCHANT', 'data': card };
  }
  
  // link card to merchant
  var cards = merchant.cards;
  if (!cards) {
    cards = [];
  }
  var newCard = {
    'number': card.number,
    'pin': card.pin
  };
  cards.push(newCard);
  
  const update = {
    "$set": {
      "cards": cards
    }
  };
    
  const query = { "_id": merchant._id };
  const options = { "upsert": false };
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  await merchants.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated merchant`);
      }
    })
    .catch(err => console.error(`Failed to update merchant: ${err}`));
    
  // return the updated cardholder
  merchant = await context.functions.execute("utils_getMerchantById", userId);
  
  // set associated merchant to card
  const setAssociatedMerchantToCardResult = await context.functions.execute("utils_setAssociatedMerchantToCard", cardNumber, merchant.userId);
  console.log('utils_setAssociatedMerchantToCard: ', setAssociatedMerchantToCardResult);
  
  return { 'success': true, 'message': 'CARD_ADD_TO_MERCHANT', 'data': merchant };
};

//exports(new BSON.ObjectId('62717ca350ac436de2e534bf'), '1234567891', '321')