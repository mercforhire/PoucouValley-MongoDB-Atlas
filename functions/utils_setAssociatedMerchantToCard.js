exports = async function(cardNumber, userId) {
  var card = await context.functions.execute("utils_getCardByNumber", cardNumber);
  console.log('card: ' + card);
  if (!card) {
    return {
      'success': false,
      'message': 'CARD_DOES_NOT_EXIST',
      'data': cardNumber
    };
  }
  if (card.associatedMerchant) {
    return {
      'success': false,
      'message': 'CARD_ALREADY_HAS_ASSOCIATED_MERCHANT',
      'data': cardNumber
    };
  }
  
  const merchant = await context.functions.execute("utils_getMerchantById", userId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return {
      'success': false,
      'message': 'MERCHANT_DOES_NOT_EXIST',
      'data': userId
    };
  }
  
  const update = {
    "$set": {
      "associatedMerchant": userId
    }
  };
  const query = {
    "number": cardNumber
  };
  const options = {
    "upsert": false
  };

  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
  await cards.updateOne(query, update, options)
    .then(result => {
      const {
        matchedCount,
        modifiedCount
      } = result;
      if (matchedCount && modifiedCount) {
        console.log(`Successfully updated card`);
      }
    })
    .catch(err => console.error(`Failed to update card: ${err}`));

  card = await context.functions.execute("utils_getCardByNumber", cardNumber);
  
  return {
    'success': true,
    'message': "SET_ASSOCIATED_CARDHOLDER_TO_CARD SUCCESS",
    'data': card
  };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))