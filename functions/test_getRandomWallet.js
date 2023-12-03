exports = async function() {
  // test_getRandomUser
  const user =  await context.functions.execute("test_getRandomUser");
  if (!user) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  const response =  await context.functions.execute("api_fetchWallet", user.apiKey);
  if (!response.success) {
    return { 'success': false, 'message': 'WALLET_DOES_NOT_EXIST', 'data': null };
  }
  
  return response;
};

//exports()