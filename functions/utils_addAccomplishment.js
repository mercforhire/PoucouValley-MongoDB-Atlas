exports = async function(userId, goalId) {
  // check user exist
  const user = await context.functions.execute("utils_getUserById", userId);
  console.log('user: ' + user);
   if (!user) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': userId }
  }
  
  // check goal exist
  const goal = await context.functions.execute("utils_getGoal", goalId);
  console.log('goal: ' + goal);
   if (!goal) {
    return { 'success': false, 'message': 'GOAL_DOES_NOT_EXIST', 'data': goalId }
  }
  
  // check if accomplishment already exist
  const alreadyExistAccomplishment = await context.functions.execute("utils_getAccomplishment", userId, goalId);
  console.log('alreadyExistAccomplishment: ' + alreadyExistAccomplishment);
   if (alreadyExistAccomplishment) {
    return { 'success': true, 'message': 'GOAL_ALREADY_ACCOMPLISHED', 'data': goalId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("accomplishments");
  const query = { 'goalId': goalId, 'userId': userId };
  const newItem = { 
    'goalId': goalId,
    'userId': userId
  };
  const options = { upsert: true };
			
	var matchedCount = 0;
	var modifiedCount = 0;
  await collection.updateOne(query, newItem, options)
    .then(result => {
      matchedCount = result.matchedCount;
      modifiedCount = result.modifiedCount;
      if (matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
    
  // check if wallet exist
  var wallet = await context.functions.execute("utils_getWalletByUserId", userId);
  console.log('wallet: ' + wallet);
  
  // if wallet not exist, init one
  if (!wallet) {
    const newWalletResult = await context.functions.execute("utils_initWallet", userId);
    wallet = newWalletResult.data;
  }
  
  // update wallet coins amount
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query2 = { 'userId': userId };
  const options2 = { "upsert": false };
  const update = { $inc: { coins: goal.reward } };
  await wallets.updateOne(query2, update, options2)
    .then(result => {
      console.log(`Successfully updated wallet.`)
    })
    .catch(err => console.error(`Failed to update transaction: ${err}`))
    
  if (matchedCount == 0) {
    // add a transaction
    const transactions = cluster.db("poucouValley").collection("transactions");
    const newTransactionParams = { 
      'createdDate': new Date(),
      "userId": userId,
      "cost": goal.reward,
      "itemId": goal._id,
      "itemName": goal.goal,
      "type": "reward"
    };
  	
    await transactions.insertOne(newTransactionParams)
      .then(result => {
        console.log(`Successfully inserted transaction.`)
      })
      .catch(err => console.error(`Failed to insert transaction: ${err}`))
  }
  
  return { 'success': true, 'message': 'accomplishment added.', 'data': null };
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'), new BSON.ObjectId('6293069c02e83cefed480a19'))