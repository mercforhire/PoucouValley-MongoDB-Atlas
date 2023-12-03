exports = async function(apiKey) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if the merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", userId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': userId };
  }
  
  // get visit records
  const cluster = context.services.get("mongodb-atlas");
  const visitRecords = cluster.db("poucouValley").collection("visitRecords");
  const query = {
    "merchantUserId": userId
  };
		
	var visits;
  await visitRecords.find(query)
    .sort({ createdDate: 1 })
    .toArray()
    .then(result => {
      visits = result;
      console.log(`Successfully query visitRecords.`)
    })
    .catch(err => console.error(`Failed to query visitRecords: ${err}`))
    
  return { 'success': true, 'message': "GET VISITORS SUCCESS", 'data': visits };
};

//exports('3cf8e4693d767ca2234f2a122bc3977e24202fd4b4c56c1144f8604e2124da442b12ee4be527b37bd1273ef1198880282ac3c1dee94597f551035318b082b797');