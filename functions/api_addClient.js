exports = async function(apiKey, { cardholderUserId, firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact }) {
  // check if apiKey valid
  var merchantUserId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantUserId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  return await context.functions.execute("utils_addClient", merchantUserId, { cardholderUserId, firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact });
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })