exports = async function(cardNumber) {
  var card = await context.functions.execute("utils_getCardByNumber", cardNumber);
  console.log('card: ' + card);
  if (!card) {
    return {
      'success': false,
      'message': 'CARD_DOES_NOT_EXIST',
      'data': cardNumber
    };
  }
  if (!card.associatedCardholder) {
    return {
      'success': false,
      'message': 'CARD_ALREADY_HAS_NO_ASSOCIATED_CARDHOLDER',
      'data': cardNumber
    };
  }
  
  const update = {
    "$unset": {
      "associatedCardholder": ""
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
    'message': "REMOVE_ASSOCIATED_CARDHOLDER_FROM_CARD SUCCESS",
    'data': card
  };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))