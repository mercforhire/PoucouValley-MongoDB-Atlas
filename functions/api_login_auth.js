exports = async function (payload) {
  // 1. Parse the `payload` object, which holds data from the
  //    FunctionCredential sent by the SDK.
  const { email, verifyCode } = payload;
  
  // check user of email is valid
  const checkLoginEmailResult = await context.functions.execute("api_checkLoginEmail", email);
  const userExist = checkLoginEmailResult.data;
  console.log('checkLoginEmail: ' + userExist);
  if (!userExist) {
    throw new Error(`Authentication failed, user of email ${email} not found.`);
  }
  
  // You can use a client library from npm
  const loginResult = await context.functions.execute("api/login", email, verifyCode);
  
  const logginedInUser = loginResult.data;
  
  // 3. Return a unique identifier for the user. Typically this is the
  //    user's ID in the external authentication system or the _id of a
  //    stored MongoDB document that describes them.
  //
  //    !!! This is NOT the user's internal Realm account ID. !!!
  if (logginedInUser) {
    return { "id": logginedInUser._id.toString() }
  }
  
  throw new Error(`Authentication failed, verifyCode ${verifyCode} incorrect.`);
};

//exports({email: 'Tess.Oberbrunner@hotmail.com', verifyCode: '1465' });