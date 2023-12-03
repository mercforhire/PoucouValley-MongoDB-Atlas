exports = async function(merchantId) {
  // check if merchant exist
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const visitRecords = cluster.db("poucouValley").collection("visitRecords");
  const query = {
       'merchantUserId': merchantId
     };
  
  var count;
	await visitRecords.count(query)
    .then(result => {
      console.log(`Successfully query.`)
      count = result;
    })
    .catch(err => console.error(`Failed to query: ${err}`))
  
  return { 'success': true, 'message': "SUCCESS", 'data': count };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'))