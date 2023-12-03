exports = async function(apiKey){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': null };
  }
  
  // check cardholder exist
  const cardholder = await context.functions.execute("utils_getCardholderById", userId);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOESNT_EXIST', 'data': userId };
  }
  if (cardholder.card == undefined || cardholder.card == null) {
    return { 'success': false, 'message': 'CARDHOLDER_HAS_NO_CARD', 'data': null };
  }
  
  // get the card
  var card = await context.functions.execute("utils_getCardByNumber", cardholder.card);
  if (!card) {
    return { 'success': false, 'message': 'CARD_NUMBER_INVALID', 'data': null };
  }
  
  if (card.associatedMerchant) {
    var merchant = await context.functions.execute("utils_getMerchantById", card.associatedMerchant);
    card.associatedMerchant = merchant;
  }
    
  return { 'success': true, 'message': "SUCCESS", 'data': card };
};
 