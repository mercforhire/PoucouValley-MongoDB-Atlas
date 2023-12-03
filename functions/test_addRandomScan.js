exports = async function() {
  // pick to a random cardholder
  const cardholder = await context.functions.execute("test_getRandomCardholder");
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': null };
  }
  
  // pick a random merchant
  const merchant = await context.functions.execute("test_getRandomMerchant");
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': null };
  }
  
  // get the merchant user 
  const user = await context.functions.execute("utils_getUserByID", merchant.userId);
  console.log('user: ' + user);
  if (!user) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // add the scan record
  const result = await context.functions.execute("api_scanCard", user.apiKey, { 'cardNumber': cardholder.card });
  return result;
};
