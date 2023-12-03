exports = async function(userType) {
  const { faker } = require('@faker-js/faker');
	const email = faker.internet.email().toLowerCase();
  
  // check if email is used
  const checkRegisterEmailResult = await context.functions.execute("api_checkRegisterEmail", email);
  const emailDoesNotExist = checkRegisterEmailResult.success;
  console.log('checkRegisterEmail: ' + emailDoesNotExist);
  if (!emailDoesNotExist) {
    return { 'success': false, 'message': 'EMAIL_ALREADY_EXIST', 'data': null } ;
  }
  
  // add a verify code entry
  const sendEmailCodeResult = await context.functions.execute("api_sendEmailCode", email);
  if (!sendEmailCodeResult.success) {
    return { 'success': false, 'message': 'Failed to send email code', 'data': null } ;
  }
  const code = await context.functions.execute("utils_getCode", email);
  
  // add new user
  if (!userType) {
    userType = Math.random() < 0.5 ? 'cardholder' : 'merchant';
  }
  
  const registerResult = await context.functions.execute("api_register", email, code, userType);
  return registerResult;
};
//exports('cardholder')
//exports('merchant')