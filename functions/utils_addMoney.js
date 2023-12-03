exports = async function(merchantUserId, cardholderUserId, amount) {
  // check if merchant User exist
  const merchantUser = await context.functions.execute("utils_getUserById", merchantUserId);
  console.log('fromUser: ' + merchantUser);
  if (!merchantUser) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if cardholder User exist
  const cardholderUser = await context.functions.execute("utils_getUserById", cardholderUserId);
  console.log('cardholderUser: ' + cardholderUser);
  if (!cardholderUser) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if amount exist
  if (!amount) {
    return { 'success': false, 'message': 'INVALID_AMOUNT', 'data': amount };
  }
  
  // check if merchant user wallet exist
  var merchantWallet = await context.functions.execute("utils_getWalletByUserId", merchantUserId);
  console.log('merchantWallet: ' + merchantWallet);
  if (!merchantWallet) {
    const initWalletResult = await context.functions.execute("utils_initWallet", merchantUserId);
    merchantWallet = initWalletResult.data;
  }
  
  // check if to cardholder user wallet exist
  var cardholderWallet = await context.functions.execute("utils_getWalletByUserId", cardholderUserId);
  console.log('cardholderWallet: ' + cardholderWallet);
  if (!cardholderWallet) {
    const initWalletResult = await context.functions.execute("utils_initWallet", cardholderUserId);
    cardholderWallet = initWalletResult.data;
  }
  
  // update merchant Wallet coins amount
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query1 = { 'userId': merchantUserId };
  const update1 = { $inc: { coins: amount } };
  await wallets.updateOne(query1, update1)
    .then(result => {
      console.log(`Successfully updated merchantWallet.`)
    })
    .catch(err => console.error(`Failed to update merchantWallet: ${err}`))
  
  // update cardholder coins amount
  const query2 = { 'userId': cardholderUserId };
  const update2 = { $inc: { coins: amount } };
  await wallets.updateOne(query2, update2)
    .then(result => {
      console.log(`Successfully updated cardholderWallet.`)
    })
    .catch(err => console.error(`Failed to update cardholderWallet: ${err}`))
    
  // add transaction
  const addTransactionResult = await context.functions.execute("utils_addScanTransaction", merchantUserId, cardholderUserId, amount);
  if (!addTransactionResult.success) {
    return addTransactionResult;
  }
  
  return { 'success': true, 'message': 'MONEY_TRANSFERED_FROM_WALLET_TO_ANOTHER_WALLET', 'data': addTransactionResult.data };
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'), new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'), 100);