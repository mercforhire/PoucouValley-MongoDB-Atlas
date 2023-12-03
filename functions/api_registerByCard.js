exports = async function(cardNumber, code, email) {
  const cluster = context.services.get("mongodb-atlas");
  
  // check if the card is already used
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query = { "card": cardNumber };
	var existingCardholder;
  await cardholders.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholder: ${result}`)
        existingCardholder = result
      } else {
        console.log("No cardholder matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find cardholder: ${err}`))
  if (existingCardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_ALREADY_EXIST', 'data': null }
  }
  
  // check card code is correct
  const card = await context.functions.execute("utils_checkCardAndPin", cardNumber, code);
  if (!card) {
    return { 'success': false, 'message': 'CARD_PIN_INCORRECT', 'data': null }
  }
  
  // check if email already exist
  const checkRegisterEmailResult = await context.functions.execute("api_checkRegisterEmail", email);
  const emailAlreadyExist = checkRegisterEmailResult.data;
  if (!emailAlreadyExist) {
    return { 'success': false, 'message': 'EMAIL_ALREADY_EXIST', 'data': false } 
  }
  
  // add new user
  const token = context.functions.execute("utils_generateAPIKey");
  const users = cluster.db("poucouValley").collection("users");
  const query2 = { 'email': email };
  const newUser = { 
    'email': email,
    "userType": "cardholder",
    'createdDate': new Date(),
    'apiKey': token
  };
  const options = { upsert: true };
			
  await users.updateOne(query2, newUser, options)
    .then(result => {
      console.log('new user added')
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
  
  // add new cardholder or merchant
  var newUserId;
  await users.findOne(query2)
    .then(result => {
      console.log('users.findOne: ' + result);
      newUserId = result._id;
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
    
  await context.functions.execute("utils_initWallet", newUserId);
  await context.functions.execute("utils_createNewCardholder", newUserId);
  await context.functions.execute("utils_setAssociatedCardholderToCard", cardNumber, newUserId);
  
  const loginResult = await context.functions.execute("api_login", email, '9999');
  return loginResult ;
};

//exports('1234567890', '123', 'feiyangca1@yahoo.ca')