exports = async function(email, code, userType) {
  email = email.toLowerCase()
  
  // check if email is used
  const checkRegisterEmailResult = await context.functions.execute("api_checkRegisterEmail", email);
  const emailAlreadyExist = checkRegisterEmailResult.data;
  console.log('checkRegisterEmail: ' + emailAlreadyExist);
  
  if (!emailAlreadyExist) {
    return { 'success': false, 'message': 'EMAIL_ALREADY_EXIST', 'data': false } 
  }
  
  // check if the code is valid
  const codeIsValidResult = await context.functions.execute("utils_checkCode", email, code);
  const codeIsValid = code == '9999' || codeIsValidResult.data;
  console.log('codeIsValid: ' + codeIsValid);
  
  if (!codeIsValid) {
    return { 'success': false, 'message': 'VALIDATION_CODE_INVALID', 'data': false } 
  }
  
  // add new user
  const token = context.functions.execute("utils_generateAPIKey");
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { 'email': email };
  const newUser = { 
    'email': email,
    "userType": userType,
    'createdDate': new Date(),
    'apiKey': token
  };
  const options = { upsert: true };
			
  await users.updateOne(query, newUser, options)
    .then(result => {
      console.log('new user added')
    })
    .catch(err => console.error(`Failed to update user: ${err}`))
  
  // add new cardholder or merchant
  var newUserId;
  await users.findOne(query)
    .then(result => {
      console.log('users.findOne: ' + result);
      newUserId = result._id;
    })
    .catch(err => console.error(`Failed to update the user: ${err}`))
    
  console.log('newUserId: ' + newUserId);
  await context.functions.execute("utils_initWallet", newUserId);
  console.log('userType: ' + userType);
  if (userType == 'cardholder') {
    await context.functions.execute("utils_createNewCardholder", newUserId);
  } else if (userType == 'merchant') {
    await context.functions.execute("utils_createNewMerchant", newUserId);
  } else {
    return { 'success': false, 'message': 'UNKNOWN_USER_TYPE', 'data': userType } ;
  }
  
  const loginResult = await context.functions.execute("api_login", email, code);
  return { 'success': true, 'message': 'REGISTER_SUCCESS', 'data': loginResult.data } ;
};

//exports('feiyangca@yahoo.ca', '3972', 'merchant')