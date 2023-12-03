exports = async function(apiKey) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", userId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'CALLER_IS_NOT_MERCHANT', 'data': userId };
  }
  
  // wallet coins
  var merchantWallet = await context.functions.execute("utils_getWalletByUserId", userId);
  console.log('fromUserWallet: ' + merchantWallet);
  if (!merchantWallet) {
    const initWalletResult = await context.functions.execute("utils_initWallet", userId);
    merchantWallet = initWalletResult.data;
  }
  
  // ranking within the category (LATER)
  
  
  // followers count
  const numberOfFollowersResult = await context.functions.execute("utils_getNumberOfFollowers", userId);
    
  // visits count
  const numberOfVisitsResult = await context.functions.execute("utils_getNumberOfVisits", userId);
  
  // all visit records
  const visitorsResult = await context.functions.execute("api_getVisitors", apiKey);
  
  return { 'success': true, 'message': "SUCCESS", 'data': { 
    coins: merchantWallet.coins,  
    followers: numberOfFollowersResult.data, 
    visits: numberOfVisitsResult.data,
    visitors: visitorsResult.data
    }
  };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d')
