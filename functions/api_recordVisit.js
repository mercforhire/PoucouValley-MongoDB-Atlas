exports = async function(apiKey, { merchantId } ) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // add the visit record
  const cluster = context.services.get("mongodb-atlas");
  const visitRecords = cluster.db("poucouValley").collection("visitRecords");
			
  const params = { 
    'createdDate': new Date(),
    "userId": userId,
    "merchantUserId": merchantId
  };
		
	var insertedId;
  await visitRecords.insertOne(params)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted.`)
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  const getVisitRecord = await context.functions.execute("utils_getVisitRecord", insertedId);
  return { 'success': true, 'message': "INSERT VISIT RECORD SUCCESS", 'data': getVisitRecord };
};

//exports(new BSON.ObjectId('6274797d50ac436de2d2c1a4'), new BSON.ObjectId('626eee7b50ac436de219da89'))