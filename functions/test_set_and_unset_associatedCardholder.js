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
  
  const setAssociatedCardholderToCardResult = await context.functions.execute("utils_setAssociatedCardholderToCard", testCard.number, userId);
  console.log(`setAssociatedCardholderToCardResult:`, JSON.stringify(setAssociatedCardholderToCardResult))
  if (!setAssociatedCardholderToCardResult.success) {
    return setAssociatedCardholderToCardResult;
  }
  
  const removeAssociatedCardholderFromCardResult = await context.functions.execute("utils_removeAssociatedCardholderFromCard", testCard.number);
  console.log(`removeAssociatedCardholderFromCardResult:`, JSON.stringify(removeAssociatedCardholderFromCardResult))
  if (!removeAssociatedCardholderFromCardResult.success) {
    return removeAssociatedCardholderFromCardResult;
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
  
  return { 'success': true, 'message': "test_set_and_unset_associatedCardholder SUCCESS", 'data': null };
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'))