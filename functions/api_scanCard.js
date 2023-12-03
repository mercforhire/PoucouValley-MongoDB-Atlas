exports = async function(apiKey, { cardNumber }) {
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // check if card exist
  const card = await context.functions.execute("utils_getCardByNumber", cardNumber);
  console.log('card: ' + card);
  if (!card) {
    return { 'success': false, 'message': 'CARD_NOT_EXIST', 'data': cardNumber };
  }
  
  // check if cardholder exist
  const cardholder = await context.functions.execute("utils_getCardholderByCardNumber", cardNumber);
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_NOT_FOUND', 'data': cardNumber };
  }
  
  // add a scan record
  const cluster = context.services.get("mongodb-atlas");
  const scanRecords = cluster.db("poucouValley").collection("scanRecords");
  const update = { 
    'createdDate': new Date(),
    "cardNumber": cardNumber,
    "cardholderUserId": cardholder.userId,
    "merchantUserId": merchantId
  };

  await scanRecords.insertOne(update)
    .then(result => {
      console.log(`Successfully inserted scan record.`);
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  // copy the cardholder to the merchant's client list
  const addCardholderToMerchantClientsResult = await context.functions.execute("api_addCardholderToMerchantClients", apiKey, { 'cardholderUserId': cardholder.userId });
  
  // add coin to both merchant wallet and cardholder wallet
  const amountToGive = 1;
  const transferMoneysResult = await context.functions.execute("utils_addMoney", merchantId, cardholder.userId, amountToGive);
  await context.functions.execute("utils_sendCardScannedMessage", cardholder.userId, merchantId, amountToGive);
  return { 'success': true, 'message': 'SCAN CARD COMPLETE', 'data': transferMoneysResult.data };
};
//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d', { cardNumber: 'M-101778-Z' })
