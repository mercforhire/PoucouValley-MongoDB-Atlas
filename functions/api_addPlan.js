exports = async function(apiKey, { title, description, photos, price, discountedPrice, hashtags } ) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  
  const cluster = context.services.get("mongodb-atlas");
  const plans = cluster.db("poucouValley").collection("plans");
  const newPlanParams = { 
    'createdDate': new Date(),
    'merchant': userId,
    "title": title,
    "description": description,
    "photos": photos,
    "price": (price != null && price > 0) ? price : null,
    "discountedPrice": (discountedPrice != null && discountedPrice > 0) ? discountedPrice : null,
    "hashtags": hashtags
  };
		
	var insertedId;
  await plans.insertOne(newPlanParams)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted plan.`)
    })
    .catch(err => console.error(`Failed to insert plan: ${err}`))
    
  const newPlan = await context.functions.execute("utils_getPlan", insertedId);
  return { 'success': true, 'message': "plan inserted", 'data': newPlan };
};

//exports(new BSON.ObjectId('627202c668d0c59a37664710'), { title: "10% off", description: "Discount!!!!!", photos: [] } )