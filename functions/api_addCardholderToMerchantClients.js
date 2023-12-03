exports = async function(apiKey, { cardholderUserId } ) {
  // check if apiKey valid
  var merchantUserId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantUserId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantUserId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantUserId };
  }
  
  // check if client already exist
  var existClient = await context.functions.execute("utils_getClientByCardholderAndMerchantUserId", cardholderUserId, merchantUserId);
  console.log('existClient: ' + existClient);
  if (existClient) {
    return { 'success': false, 'message': 'CLIENT_ALREADY_EXIST', 'data': cardholderUserId };
  }
  
  // check cardholder exist
  const cardholder = await context.functions.execute("utils_getCardholderById", cardholderUserId);
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check cardholder user exist
  const cardholderUser = await context.functions.execute("utils_getUserById", cardholderUserId);
  console.log('cardholderUser: ' + cardholderUser);
  
  const cluster = context.services.get("mongodb-atlas");
  const clientsCollection = cluster.db("poucouValley").collection("clients");
	
  const firstName = cardholder.firstName;
  const lastName = cardholder.lastName;
  const gender = cardholder.gender;
  const pronoun = cardholder.pronoun;
  const birthday = cardholder.birthday;
  const address = cardholder.address;
  const avatar = cardholder.avatar;
  const company = "";
  const jobTitle = "";
  const hashtags = [];
  const notes = "";
  const contact = cardholder.contact;
  const email = cardholderUser.email;
   
  const result = await context.functions.execute("utils_addClient", merchantUserId, { cardholderUserId, firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, contact, email });
  const newClient = result.data;
  
  return { 'success': true, 'message': "cardholder copied to merchant's client list", 'data': newClient };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d', { cardholderUserId: new BSON.ObjectId('62d397d39f467f7f9eaccb99') })
