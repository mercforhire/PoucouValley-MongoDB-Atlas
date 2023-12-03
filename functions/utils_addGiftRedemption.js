exports = async function(userId, gift, transaction){
  // check if userId valid
  var user = await context.functions.execute("utils_getUserById", userId);
  if (!user) {
    return { 'success': false, 'message': 'USERID_INVALID', 'data': userId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const giftRedemptions = cluster.db("poucouValley").collection("giftRedemptions");
	
  const newRedemption = { 
    'createdDate': new Date(),
    "userId": userId, 
    "gift": gift,
    "transaction": transaction
  };
	
	var insertedId;
  await giftRedemptions.insertOne(newRedemption)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted gift redemption.`)
    })
    .catch(err => console.error(`Failed to insert gift redemption: ${err}`))
    
  const newGiftRedemption = await context.functions.execute("utils_getGiftRedemption", insertedId);
  
  return { 'success': true, 'message': "gift redemption inserted", 'data': newGiftRedemption };
};