exports = async function() {
  // pick to a random cardholder
  const cardholder = await context.functions.execute("test_getRandomCardholder");
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  const user = await context.functions.execute('utils_getUserById', cardholder.userId);
  if (!user) {
    return { 'success': false, 'message': "USER NOT FOUND", 'data': null };
  }
  
  // pick a random merchant
  const merchant = await context.functions.execute("test_getRandomMerchant");
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // add the follow record
  const response = await context.functions.execute("api_followMerchant", user.apiKey, { merchantId: merchant.userId });
  return response;
};

//exports(new BSON.ObjectId('6274797d50ac436de2d2c1a4'), new BSON.ObjectId('626eee7b50ac436de219da89'))