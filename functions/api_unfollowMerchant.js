exports = async function(apiKey, { merchantId } ) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': userId };
  }
  
  // check if user exist
  const cardholder = await context.functions.execute("utils_getCardholderById", userId);
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': userId };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // add the follow record
  const cluster = context.services.get("mongodb-atlas");
  const followRecords = cluster.db("poucouValley").collection("followRecords");
	const query = { 'userId': userId, 'merchantUserId': merchantId };

  await followRecords.deleteMany(query)
    .then(result => {
      console.log(`Successfully deleted.`)
    })
    .catch(err => console.error(`Failed to deleted: ${err}`))
  
  return { 'success': true, 'message': "DELETE FOLLOW RECORD SUCCESS", 'data': null };
};

//exports('35d4400a0722290fd669bbd8b3dae042bae43339193cfe7d6816f9a448664fcfdcb90a1e1e1edfb9210a7e926d81afead1c95bdf9eae6079a6d9e64a574be555', { merchantId: new BSON.ObjectId('62d2fec69f467f7f9e50c8e9') })