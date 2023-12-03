exports = async function(apiKey, { cardNumber, cardPin }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check cardholder exist
  var cardholder = await context.functions.execute("utils_getCardholderById", userId);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_NOT_FOUND', 'data': null };
  }
  
  // check card is not used by another cardholder
  const existingCardholder = await context.functions.execute("utils_getCardholderByCardNumber", cardNumber);
  if (existingCardholder) {
    return { 'success': false, 'message': 'CARD_ALREADY_USED', 'data': existingCardholder };
  }
  
  // check card number and pin 
  const card = await context.functions.execute("utils_checkCardAndPin", cardNumber, cardPin);
  if (!card) {
    return { 'success': false, 'message': 'CARD_PIN_INCORRECT', 'data': null };
  }
  
  if (cardholder.card) {
    const removeAssociatedCardholderFromCardResult = await context.functions.execute("utils_removeAssociatedCardholderFromCard", cardholder.card);
    if (!removeAssociatedCardholderFromCardResult.success) {
      return { 'success': false, 'message': 'Remove previous link card error', 'data': null };
    }
  }
  
  // link card to card holder
  const cluster = context.services.get("mongodb-atlas");
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query = { 'userId': userId };
  const update = {
      "$set": {
        "card": cardNumber
      }
    };
  const options = { "upsert": false };
  await cardholders.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated cardholder`)
      }
    })
    .catch(err => console.error(`Failed to update card number: ${err}`))
    
  // set associated merchant to card
  const setAssociatedCardholderToCard = await context.functions.execute("utils_setAssociatedCardholderToCard", cardNumber, userId);
  console.log('utils_setAssociatedCardholderToCard: ', setAssociatedCardholderToCard);
  
  // return the updated cardholder
  cardholder = await context.functions.execute("utils_getCardholderById", userId);
  
  return { 'success': true, 'message': 'CARD_ADD_TO_CARDHOLDER', 'data': cardholder };
};

//exports('35d4400a0722290fd669bbd8b3dae042bae43339193cfe7d6816f9a448664fcfdcb90a1e1e1edfb9210a7e926d81afead1c95bdf9eae6079a6d9e64a574be555', { cardNumber: 'C-774005-G', cardPin: '400' })