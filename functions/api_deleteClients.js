exports = async function(apiKey, clientIds) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  return await context.functions.execute("utils_deleteClients", userId, clientIds);
};

//exports('d9ae026ec60ee1f56e34bc185b22c411ff0576fd358caf442c7774bd76790197e7e7ee2b51226aeed42ef81b50a844e1cf2223cd7acfb8ccdc4b698c6414bcd7', [new BSON.ObjectId('62cf644e1d9f4d1daa938403')]);