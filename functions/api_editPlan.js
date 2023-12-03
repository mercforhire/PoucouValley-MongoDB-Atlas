exports = async function(apiKey, planId, { title, description, photos, price, discountedPrice, hashtags }) {
  // check if apiKey valid
  var merchantUserId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantUserId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if plan exist
  var existPlan = await context.functions.execute("utils_getPlan", planId);
  if (!existPlan) {
    return { 'success': false, 'message': 'PLAN_DOES_NOT_EXIST', 'data': planId };
  }
  
  // check if plan belongs to the current merchantUserId
  if (merchantUserId.toString() != existPlan.merchant.toString()) {
    return { 'success': false, 'message': 'PLAN_DOES_NOT_BELONG_TO_CURRENT_USER', 'data': existPlan };
  }
  
  return await context.functions.execute("utils_editPlan", planId, { title, description, photos, price, discountedPrice, hashtags });
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })