exports = async function(apiKey, { notification }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  var result = await context.functions.execute("utils_setUserSettings", userId, { notification });
  return result;
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })