exports = async function(apiKey, { merchantUserId }) {
 // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantUserId);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_NOT_FOUND', 'data': null };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const followRecords = cluster.db("poucouValley").collection("followRecords");
  const query = { "userId": userId, "merchantUserId": merchantUserId };
  
  var followed = false;
	await followRecords.findOne(query)
    .then(result => {
      console.log(`Successfully query follow records.`);
      console.log(JSON.stringify(result));
      followed = result != null;
    })
    .catch(err => console.error(`Failed to query follow records: ${err}`))
  
  return { 'success': true, 'message': "api_fetchFollowShopStatus SUCCESS", 'data': followed };
};

//exports('35d4400a0722290fd669bbd8b3dae042bae43339193cfe7d6816f9a448664fcfdcb90a1e1e1edfb9210a7e926d81afead1c95bdf9eae6079a6d9e64a574be555', { merchantUserId: new BSON.ObjectId('62e30d4d9f467f7f9e396c32') })
