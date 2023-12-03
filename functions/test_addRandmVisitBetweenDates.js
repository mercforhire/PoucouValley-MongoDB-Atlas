function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

exports = async function(merchantId) {
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  // pick to a random cardholder
  const cardholder = await context.functions.execute("test_getRandomCardholder");
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': null };
  }
  
  // pick a Date
  const date = randomDate(new Date(2022, 0, 1), new Date());
  
  // add the visit record
  const cluster = context.services.get("mongodb-atlas");
  const visitRecords = cluster.db("poucouValley").collection("visitRecords");
			
  const params = { 
    'createdDate': date,
    "userId": cardholder.userId,
    "merchantUserId": merchantId
  };
		
	console.log(date);
	
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

//exports(new BSON.ObjectId('62f2006037e95b37a3969e2b'));