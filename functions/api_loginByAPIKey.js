exports = async function(apiKey){
  // get the user
  const user = await context.functions.execute("utils_getUserByAPIKey", apiKey);
  console.log('user: ' + user);
   if (!user) {
    return { 'success': false, 'message': 'USER_DOESNT_EXIST', 'data': null }
  }
  
  // check if user deleted himself
  const accountDeletionRequest = await context.functions.execute("utils_getDeleteAccountRequestByUserId", user._id);
  console.log('accountDeletionRequest: ' + accountDeletionRequest);
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
    const numberOfVisitsResult = await context.functions.execute("utils_getNumberOfVisits", merchant.userId);
    if (numberOfVisitsResult.data) {
      merchant.visits = numberOfVisitsResult.data;
    }
      
    const numberOfFollowersResult = await context.functions.execute("utils_getNumberOfFollowers", merchant.userId);
    if (numberOfFollowersResult.data) {
      merchant.followers = numberOfFollowersResult.data;
    }
    return { 'success': true, 'message': 'LOGIN_SUCCESS', 'data': { user, merchant } } ;
  }
};

//exports('51e78fc743970142986be7952bd71591f2675e4158d8003225e7fab3c1da297d32a81190eca15f039a96eec153a7eb375ed77ecab2772979e81beef00a678212')