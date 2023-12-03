exports = async function(apiKey) {
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': userId };
  }
  
  const activatedClientsResult = await context.functions.execute("api_getActivatedClients", apiKey);
  console.log('activatedClientsResult: ' + JSON.stringify(activatedClientsResult));
  
  const merchantCardsResult = await context.functions.execute("api_getMerchantCards", apiKey);
  console.log('merchantCardsResult: ' + JSON.stringify(merchantCardsResult));
  
  const followedClientsResult = await context.functions.execute("api_getFollowedClients", apiKey);
  console.log('followedClientsResult: ' + JSON.stringify(followedClientsResult));
  
  const inputtedClientsResult = await context.functions.execute("api_getInputtedClients", apiKey);
  console.log('inputtedClientsResult: ' + JSON.stringify(inputtedClientsResult));
  
  const scannedClientsResult = await context.functions.execute("api_getScannedClients", apiKey);
  console.log('scannedClientsResult: ' + JSON.stringify(scannedClientsResult));
  
  var result = {
    'ACTIVATED_CLIENTS': activatedClientsResult.data.length,
    'TOTAL_CARDS': merchantCardsResult.data.length,
    'FOLLOWED_CLIENTS': followedClientsResult.data.length,
    'INPUTTED_CLIENTS': inputtedClientsResult.data.length,
    'SCANNED_CLIENTS': scannedClientsResult.data.length
  };
  
  return { 'success': true, 'message': 'CLIENT_STATISTICS_FETCHED', 'data': result };
};

//exports('3cf8e4693d767ca2234f2a122bc3977e24202fd4b4c56c1144f8604e2124da442b12ee4be527b37bd1273ef1198880282ac3c1dee94597f551035318b082b797')