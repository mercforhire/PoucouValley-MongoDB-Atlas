exports = async function(apiKey, { merchantId }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': merchantId };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  const numberOfVisitsResult = await context.functions.execute("utils_getNumberOfVisits", merchant.userId);
  if (numberOfVisitsResult.data) {
    merchant.visits = numberOfVisitsResult.data;
  }
    
  const numberOfFollowersResult = await context.functions.execute("utils_getNumberOfFollowers", merchant.userId);
  if (numberOfFollowersResult.data) {
    merchant.followers = numberOfFollowersResult.data;
  }

  return { 'success': true, 'message': "api_fetchMerchant SUCCESS", 'data': merchant };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d', new BSON.ObjectId('62d5e0748bfb1bcddfa79812'));
