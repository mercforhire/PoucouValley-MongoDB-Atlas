exports = async function(userId, clientIds) {
  // check if user exist
  var existUser = await context.functions.execute("utils_getUserById", userId);
  if (!existUser) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': userId };
  }
  
  // check clientIds is valid and non-empty array
  if (!Array.isArray(clientIds) || clientIds.length == 0) {
    return { 'success': false, 'message': 'INVALID_PARAMS', 'data': clientIds };
  }
  
  var validClientIds = [];
  for (const clientId of clientIds) {
    // check if client exist
    var existClient = await context.functions.execute("utils_getClient", clientId);
    if (!existClient) {
      return { 'success': false, 'message': 'CLIENT_DOES_NOT_EXIST', 'data': clientId };
    }
    
    // check if client owner is caller user
    if (existClient.ownerId.toString() != userId.toString()) {
      console.log('current user does not own client: ' + existClient.ownerId);
      continue;
    }
    
    // check if the client is not cardholder, cardholder can't not be deleted
    if (existClient.cardholderUserId) {
      console.log('client is a cardholder: ' + existClient.cardholderUserId);
      continue;
    }
    
    validClientIds.push(clientId);
  }
  
  // delete the card from cards
  const cluster = context.services.get("mongodb-atlas");
  const clients = cluster.db("poucouValley").collection("clients");
  const query = { '_id': { '$in': validClientIds } };
  await clients.deleteMany(query)
    .then(result => {
      const { deletedCount } = result;
      if (deletedCount) {
        console.log(`Successfully deleted ${deletedCount} cards`)
      }
    })
    .catch(err => console.error(`Failed to delete: ${err}`))
  
  return { 'success': true, 'message': "DELETE CLIENT SUCCESS", 'data': validClientIds };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })