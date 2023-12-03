exports = async function(userId) {
  // check if user exist
  const existUser = await context.functions.execute("utils_getUserById", userId);
  console.log('existUser: ' + existUser);
  if (!existUser) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if wallet exist
  const walletExist = await context.functions.execute("utils_existWallet", userId);
  console.log('walletExist: ' + walletExist);
  if (walletExist) {
    return { 'success': false, 'message': 'WALLET_ALREADY_EXIST', 'data': null };
  }
  
  // add new wallet
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
			
  const newWalletParams = { 
    'createdDate': new Date(),
    "userId": userId,
    "coins": 0
  };
	
	var newWalletId;
  await wallets.insertOne(newWalletParams)
    .then(result => {
      const { insertedId } = result;
      if (insertedId) {
        console.log(`Successfully inserted wallet.`)
        newWalletId = insertedId;
      }
    })
    .catch(err => console.error(`Failed to insert wallet: ${err}`))
  if (!newWalletId) {
    return { 'success': false, 'message': 'WALLET_ADD_FAILED', 'data': null };
  }
  
  // return new wallet
  const newWallet = await context.functions.execute("utils_getWalletById", newWalletId);
  return { 'success': true, 'message': 'WALLET_ADDED', 'data': newWallet };
};

// exports(new BSON.ObjectId('626eee7b50ac436de219da89'))