exports = async function(apiKey, clientId, { firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact }) {
  // check if apiKey valid
  var merchantUserId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantUserId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if client exist
  var existClient = await context.functions.execute("utils_getClient", clientId);
  if (!existClient) {
    return { 'success': false, 'message': 'CLIENT_DOES_NOT_EXIST', 'data': clientId };
  }
  
  // check if client belongs to the current merchantUserId
  if (merchantUserId.toString() != existClient.ownerId.toString()) {
    return { 'success': false, 'message': 'CLIENT_DOES_NOT_BELONG_TO_CURRENT_USER', 'data': clientId };
  }
  
  return await context.functions.execute("utils_editClient", clientId, { firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact });
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })