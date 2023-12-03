exports = async function(apiKey, { clientId }) {
  // check if apiKey valid
  var merchantId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if the client exist
  const client = await context.functions.execute("utils_getClient", clientId);
  console.log('client: ' + client);
  if (!client) {
    return { 'success': false, 'message': 'CLIENT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  if (client.ownerId.toString() != merchantId.toString()) {
    return { 'success': false, 'message': 'CLIENT_DOES_NOT_BELONG_TO_MERCHANT', 'data': merchantId };
  }
    
  return { 'success': true, 'message': "SUCCESS", 'data': client };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d')