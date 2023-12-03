exports = async function(apiKey, { title, description, photos, price, discountedPrice, hashtags }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const promotions = cluster.db("poucouValley").collection("promotions");
			
  const newPromotionParams = { 
    'createdDate': new Date(),
    'userId': userId,
    "title": title,
    "description": description,
    "photos": photos,
    "price": price,
    "discountedPrice": discountedPrice,
    "hashtags": hashtags
  };
	
	var insertedId;
  await promotions.insertOne(newPromotionParams)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted promotion.`)
    })
    .catch(err => console.error(`Failed to insert promotion: ${err}`))
    
  const newPromotion = await context.functions.execute("utils_getPromotion", insertedId);
  
  return { 'success': true, 'message': "promotion inserted", 'data': newPromotion };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })