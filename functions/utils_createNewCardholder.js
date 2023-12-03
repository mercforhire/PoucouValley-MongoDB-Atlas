exports = async function(userId) {
  const user = await context.functions.execute('utils_getUserById', userId);
  if (!user) {
    console.error(`utils_createNewCardholder failed to find user: ${userId}`);
    return;
  }
  
  // add new user to DB
  const cluster = context.services.get("mongodb-atlas");
  const cardholders = cluster.db("poucouValley").collection("cardholders");
		
  const query = { 'userId': userId };
  const newCardholder = {
    "userId": userId,
    'createdDate': new Date(),
    'contact': {
      'email': user.email
    }
  };
  const options = { upsert: true };
	
	var insertedId;
  await cardholders.updateOne(query, newCardholder, options)
    .then(result => {
      insertedId = result.insertedId;
    })
    .catch(err => console.error(`Failed to update the cardholder: ${err}`))
  
  const cardholder = await context.functions.execute("utils_getCardholderById", userId);
  return cardholder;
};

//exports('626eee7b50ac436de219da89')