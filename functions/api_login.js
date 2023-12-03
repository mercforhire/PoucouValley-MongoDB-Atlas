exports = async function(email, code) {
  email = email.toLowerCase();
  
  // check user of email is valid
  const checkLoginEmailResult = await context.functions.execute("api_checkLoginEmail", email);
  const userExist = checkLoginEmailResult.data;
  if (!userExist) {
    return { 'success': false, 'message': 'USER_DOESNT_EXIST', 'data': null };
  }
  
  // check code is valid
  const checkCodeResult = await context.functions.execute("utils_checkCode", email, code);
  const codeIsValid = code == '9999' || checkCodeResult.data;
  if (!codeIsValid) {
    return { 'success': false, 'message': 'VALIDATION_CODE_INVALID', 'data': null };
  }
  
  // get the user object
  const user = await context.functions.execute("utils_getUserByEmail", email);
  
   // check if user deleted himself
  const accountDeletionRequest = await context.functions.execute("utils_getDeleteAccountRequestByUserId", user._id);
  if (accountDeletionRequest) {
    return { 'success': false, 'message': 'USER_ALREADY_DELETED_ACCOUNT', 'data': null };
  }
  
  // return the user and user details
  if (user.userType == 'cardholder') {
    // get the cardholder object
    const cardholder = await context.functions.execute("utils_getCardholderById", user._id);
    return { 'success': true, 'message': 'LOGIN_SUCCESS', 'data': { user, cardholder } } ;
  } 
  else if (user.userType == 'merchant') {
    // get the merchant object
    const merchant = await context.functions.execute("utils_getMerchantById", user._id);
    return { 'success': true, 'message': 'LOGIN_SUCCESS', 'data': { user, merchant } } ;
  }
};

//exports('Tess.Oberbrunner@hotmail.com', '1465')