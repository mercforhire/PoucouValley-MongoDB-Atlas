exports = async function() {
  // get random gift
  const gift = await context.functions.execute("test_getRandomGift");
  console.log('gift: ' + gift);
  if (!gift) {
    return { 'success': false, 'message': 'GIFTS_TABLE_EMPTY', 'data': null };
  }
  const giftId = gift._id;
  
  // pick random user
  const user = await context.functions.execute("test_getRandomUser");
  console.log('user: ' + user);
  if (!user) {
    return { 'success': false, 'message': 'USERS_TABLE_EMPTY', 'data': null };
  }
  const userId = user._id;
  const apiKey = user.apiKey;
  
  // check if wallet exist
  var wallet = await context.functions.execute("utils_getWalletByUserId", userId);
  console.log('wallet: ' + wallet);
  
  // if wallet not exist, init one
  if (!wallet) {
    const newWalletResult = await context.functions.execute("utils_initWallet", userId);
    wallet = newWalletResult.data;
  }
  
  // if wallet has no money, 626eee7b50ac436de219da89
  if (wallet.coins < gift.costInCoins) {
    const newWalletResult = await context.functions.execute("test_addMoneyToWallet", userId);
    wallet = newWalletResult.data;
  }
  
  const newRedeemResult = await context.functions.execute("api_redeemGift", apiKey, { 'giftId': giftId });
  return newRedeemResult;
};

// exports(new BSON.ObjectId('626eee7b50ac436de219da89'), new BSON.ObjectId('6271dbde3c2faad5bd8bcdf0'))
