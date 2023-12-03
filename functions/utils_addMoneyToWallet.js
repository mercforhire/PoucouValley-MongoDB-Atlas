exports = async function(userId, amount) {
  // check if user exist
  const existUser = await context.functions.execute("utils_getUserById", userId);
  console.log('existUser: ' + existUser);
  if (!existUser) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null };
  }
  
  // check if amount exist
  if (!amount) {
    return { 'success': false, 'message': 'INVALID_AMOUNT', 'data': amount };
  }
  
  // check if wallet exist
  var walletExist = await context.functions.execute("utils_getWalletByUserId", userId);
  console.log('walletExist: ' + walletExist);
  if (!walletExist) {
    const initWalletResult = await context.functions.execute("utils_initWallet", userId);
    walletExist = initWalletResult.data;
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
	const query = { "userId": userId };
  const update = { 
    "$set": {
      "coins": amount
    }
  };
	const options = { "upsert": false };
	
  await wallets.updateOne(query, update, options)
    .then(result => {
      console.log(`Successfully updated wallet.`)
    })
    .catch(err => console.error(`Failed to insert wallet: ${err}`))

  
  // return new wallet
  const newWallet = await context.functions.execute("utils_getWalletById", walletExist._id);
  
  return { 'success': true, 'message': 'MONEY_ADDED_TO_WALLET', 'data': newWallet };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'), 1000);