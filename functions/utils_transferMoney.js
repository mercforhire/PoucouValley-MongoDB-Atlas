exports = async function(fromUserId, toUserId, amount) {
  // check if fromUser exist
  const fromUser = await context.functions.execute("utils_getUserById", fromUserId);
  console.log('fromUser: ' + fromUser);
  if (!fromUser) {
    return { 'success': false, 'message': 'FROM_USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if toUser exist
  const toUser = await context.functions.execute("utils_getUserById", toUserId);
  console.log('toUser: ' + toUser);
  if (!toUser) {
    return { 'success': false, 'message': 'TO_USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if amount exist
  if (!amount) {
    return { 'success': false, 'message': 'INVALID_AMOUNT', 'data': amount };
  }
  
  // check if from user wallet exist
  var fromUserWallet = await context.functions.execute("utils_getWalletByUserId", fromUserId);
  console.log('fromUserWallet: ' + fromUserWallet);
  if (!fromUserWallet) {
    const initWalletResult = await context.functions.execute("utils_initWallet", fromUserId);
    fromUserWallet = initWalletResult.data;
  }
  
  // check if wallet has enough coins
  if (fromUserWallet.coins < amount) {
    return { 'success': false, 'message': 'NOT_ENOUGH_COINS', 'data': null };
  }
  
  // check if to user wallet exist
  var toUserWalletExist = await context.functions.execute("utils_getWalletByUserId", toUserId);
  console.log('toUserWalletExist: ' + toUserWalletExist);
  if (!toUserWalletExist) {
    const initWalletResult = await context.functions.execute("utils_initWallet", toUserId);
    toUserWalletExist = initWalletResult.data;
  }
  
  // update fromUserWallet coins amount
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query1 = { 'userId': fromUserId };
  const update1 = { $inc: { coins: -1 * amount } };
  await wallets.updateOne(query1, update1)
    .then(result => {
      console.log(`Successfully updated fromUserWallet.`)
    })
    .catch(err => console.error(`Failed to update fromUserWallet: ${err}`))
  
  // update toUserWalletExist coins amount
  const query2 = { 'userId': toUserId };
  const update2 = { $inc: { coins: amount } };
  await wallets.updateOne(query2, update2)
    .then(result => {
      console.log(`Successfully updated toUserWalletExist.`)
    })
    .catch(err => console.error(`Failed to update toUserWalletExist: ${err}`))
    
  // add a transaction
  const addTransactionResult = await context.functions.execute("utils_addTransferTransaction", fromUserId, toUserId, amount);
  if (!addTransactionResult.success) {
    return addTransactionResult;
  }
  
  return { 'success': true, 'message': 'MONEY_TRANSFERED_FROM_WALLET_TO_ANOTHER_WALLET', 'data': newTransaction };
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'), new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'), 100);