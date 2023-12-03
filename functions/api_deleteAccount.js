exports = async function(apiKey, { reason } ) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // add to accountDeletionRequests
  const cluster = context.services.get("mongodb-atlas");
  const requests = cluster.db("poucouValley").collection("accountDeletionRequests");
			
	const query = { 'userId': userId };
  const params = { 
    'createdDate': new Date(),
    "userId": userId,
    "reason": reason
  };
	const options = { upsert: true };
	  
	var insertedId;
  await requests.updateOne(query, params, options)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted.`)
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  const newObject = await context.functions.execute("utils_getDeleteAccountRequest", insertedId);
  
  return { 'success': true, 'message': "inserted delete account request", 'data': newObject };
};

//exports(new BSON.ObjectId('6274797d50ac436de2d2c1a4'), "I quit!" )