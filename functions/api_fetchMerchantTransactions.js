exports = async function(apiKey){
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const transactions = cluster.db("poucouValley").collection("transactions");
  const query = { 'merchantId': userId };
		
	var rawTransactions = [];
  await transactions.find(query)
    .sort({ createdDate: -1 })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found transactions: ${result}.`);
        rawTransactions = result
      } else {
        console.log("No transactions matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
  
  var finalTransactions = [];
  for (const rawTransaction of rawTransactions) {
    var finalTransaction = rawTransaction;
    if (finalTransaction.userId) {
      var cardholder = await context.functions.execute("utils_getCardholderById", finalTransaction.userId);
      finalTransaction.cardholder = cardholder;
    }
    
    finalTransactions.push(finalTransaction);
  }
    
  return { 'success': true, 'message': "TRANSACTIONS FETCHED", 'data': finalTransactions };
};

//exports('6ec0f35500b2bf49e455e7f35a04e2b1d3cfbb1bc30611280166ed24ba00a2072d93fac00fbf18e8aea6a781391a7bc258d042d3ca02cd33420e1483cbc5fd84');