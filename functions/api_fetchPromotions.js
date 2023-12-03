exports = async function(apiKey, { businessUserId }){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': userId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const promotions = cluster.db("poucouValley").collection("promotions");
  const query = { 'userId': businessUserId };
		
	var results = [];
  await promotions.find(query)
    .sort({ createdDate: -1 })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found promotions: ${result}.`);
        results = result
      } else {
        console.log("No promotions matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return { 'success': true, 'message': "PROMOTIONS FETCHED", 'data': results };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'))