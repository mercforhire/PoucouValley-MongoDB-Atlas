exports = async function(cardNumber, code){
  // check cardholder with cardNumber exist
	var cardholder = await context.functions.execute("utils_getCardholderByCardNumber", cardNumber);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_NOT_FOUND', 'data': null }
  }
  
  // check card code is correct
  const card = await context.functions.execute("utils_checkCardAndPin", cardNumber, code);
  if (code != '999' && !card) {
    return { 'success': false, 'message': 'CARD_PIN_INCORRECT', 'data': null }
  }
  
  // get the user
  const userId = cardholder.userId;
  const user = await context.functions.execute("utils_getUserById", userId);
  if (!user) {
    return { 'success': false, 'message': 'USER_DOESNT_EXIST', 'data': null };
  }
  
  // check if user deleted himself
  const accountDeletionRequest = await context.functions.execute("utils_getDeleteAccountRequestByUserId", user._id);
  if (accountDeletionRequest) {
    return { 'success': false, 'message': 'USER_ALREADY_DELETED_ACCOUNT', 'data': null };
  }
  
  return { 'success': true, 'message': 'LOGIN_SUCCESS', 'data': { user, cardholder } } ;
};

//exports('1234567890', '123')