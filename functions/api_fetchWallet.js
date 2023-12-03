exports = async function(apiKey){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': null };
  }
  
  // check wallet exist
  const wallet = await context.functions.execute("utils_getWalletByUserId", userId);
  if (!wallet) {
    return { 'success': false, 'message': 'WALLET_DOESNT_EXIST', 'data': userId };
  }
  
  return { 'success': true, 'message': 'WALLET_FOUND', 'data': wallet };
};
 