exports = async function(userId) {
  const user = await context.functions.execute('utils_getUserById', userId);
  if (!user) {
    return;
  }
  
  // add new user to DB
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  const query = { 'userId': userId };
  const newMerchant = {
    "userId": userId,
    'createdDate': new Date(),
    'contact': {
      'email': user.email
    }
  };
  const options = { upsert: true };
			
  await merchants.updateOne(query, newMerchant, options)
    .then(result => {
      
    })
    .catch(err => console.error(`Failed to update the merchant: ${err}`))
    
  const merchant = await context.functions.execute("utils_getMerchantById", userId);
  return merchant;
};

//exports('626eee7b50ac436de219da89')