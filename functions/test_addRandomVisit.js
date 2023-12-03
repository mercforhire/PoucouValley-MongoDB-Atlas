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
  
  // add the visit record
  const response = await context.functions.execute("api_recordVisit", user.apiKey, { 'merchantId': merchant.userId } );
  
  return { 'success': true, 'message': "INSERT VISIT RECORD SUCCESS", 'data': null };
};
