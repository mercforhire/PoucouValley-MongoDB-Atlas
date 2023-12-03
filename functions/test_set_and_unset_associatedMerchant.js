exports = async function(userId) {
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
	
	var params = { 
    "number": "X-999999-X",
    "pin": "000"
  };
		
	var insertedId;
  await cards.insertOne(params)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted.`)
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  const testCard = await context.functions.execute("utils_getCardById", insertedId);
  
  const setAssociatedMerchantToCardResult = await context.functions.execute("utils_setAssociatedMerchantToCard", testCard.number, userId);
  console.log(`setAssociatedMerchantToCardResult:`, JSON.stringify(setAssociatedMerchantToCardResult))
  if (!setAssociatedMerchantToCardResult.success) {
    return setAssociatedMerchantToCardResult;
  }
  
  const removeAssociatedMerchantFromCardResult = await context.functions.execute("utils_removeAssociatedMerchantFromCard", testCard.number);
  console.log(`removeAssociatedMerchantFromCardResult:`, JSON.stringify(removeAssociatedMerchantFromCardResult))
  if (!removeAssociatedMerchantFromCardResult.success) {
    return removeAssociatedMerchantFromCardResult;
  }
  
  const query = { 'number': testCard.number };
  await cards.deleteMany(query)
    .then(result => {
      const { deletedCount } = result;
      if (deletedCount) {
        console.log(`Successfully deleted ${deletedCount} cards`)
      }
    })
    .catch(err => console.error(`Failed to delete: ${err}`))
  
  return { 'success': true, 'message': "test_set_and_unset_associatedMerchant SUCCESS", 'data': null };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))