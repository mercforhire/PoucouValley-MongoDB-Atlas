exports = async function(apiKey, { giftId }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // chek if gift exist
  const gift = await context.functions.execute("utils_getGift", giftId);
  console.log('gift: ' + gift);
  if (!gift) {
    return { 'success': false, 'message': 'GIFT_DOES_NOT_EXIST', 'data': giftId };
  }
  
  // check if wallet exist
  var wallet = await context.functions.execute("utils_getWalletByUserId", userId);
  console.log('wallet: ' + wallet);
  
  // if wallet not exist, init one
  if (!wallet) {
    const newWalletResult = await context.functions.execute("utils_initWallet", userId);
    wallet = newWalletResult.data;
  }
  
  if (!wallet) {
    return { 'success': false, 'message': 'FATAL ERROR', 'data': null };
  }
  
  // check if wallet has enough coins
  if (wallet.coins < gift.costInCoins) {
    return { 'success': false, 'message': 'NOT ENOUGH COINS', 'data': null };
  }
  
  const cluster = context.services.get("mongodb-atlas");

  
  // update wallet coins amount
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query = { 'userId': userId };
  const update = { $inc: { coins: -1 * gift.costInCoins } };
  await wallets.updateOne(query, update)
    .then(result => {
      console.log(`Successfully updated wallet.`)
    })
    .catch(err => console.error(`Failed to update transaction: ${err}`))
  
  // add a transaction
  const transactions = cluster.db("poucouValley").collection("transactions");
  const newTransactionParams = { 
    'createdDate': new Date(),
    "userId": userId,
    "cost": gift.costInCoins,
    "itemId": gift._id,
    "itemName": gift.name,
    "type": "redeem"
  };
		
	var insertedId;
  await transactions.insertOne(newTransactionParams)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted transaction.`)
    })
    .catch(err => console.error(`Failed to insert transaction: ${err}`))
    
  const newTransaction = await context.functions.execute("utils_getTransaction", insertedId);
  
  // add a redeem notice
  const addGiftRedemptionResult = await context.functions.execute("utils_addGiftRedemption", userId, gift, newTransaction);
  
  return { 'success': true, 'message': "GIFT REDEEMED", 'data': newTransaction };
};

// exports(new BSON.ObjectId('626eee7b50ac436de219da89'), new BSON.ObjectId('6271dbde3c2faad5bd8bcdf0'))
