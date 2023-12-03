exports = async function(merchantId, userId, amount) {
  const cluster = context.services.get("mongodb-atlas");
  const transactions = cluster.db("poucouValley").collection("transactions");
  const newTransactionParams = { 
    'createdDate': new Date(),
    "merchantId": merchantId,
    "userId": userId,
    "cost": amount,
    "type": "scan"
  };
		
	var insertedId;
  await transactions.insertOne(newTransactionParams)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted transaction.`)
    })
    .catch(err => console.error(`Failed to insert transaction: ${err}`))
    
  const newTransaction = await context.functions.execute("utils_getTransaction", insertedId);
  
  return { 'success': true, 'message': 'TRANSACTION_ADDED', 'data': newTransaction };
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'), new BSON.ObjectId('6293069c02e83cefed480a19'))