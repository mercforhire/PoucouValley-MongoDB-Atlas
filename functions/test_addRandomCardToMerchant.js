exports = async function(merchantId) {
  var merchant;
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
    
  if (merchantId) {
    // check if merchant exist
    merchant = await context.functions.execute("utils_getMerchantById", merchantId);
    console.log('merchant: ' + merchant);
    if (!merchant) {
      return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
    }
  } else {
    // pick a random merchant
    const pipeline = [
        { "$sample": 
          { 
            size: 1 
          }
        }
      ];
    
    await merchants.aggregate(pipeline)
  	  .toArray()
      .then(result => {
        if(result) {
          console.log(`Successfully found merchant: ${result}.`);
          merchant = result[0];
        } else {
          console.log("No merchant matches the provided query.");
        }
      })
      .catch(err => console.error(`Failed to query: ${err}`));
  }
  
  if (!merchant) {
    return { 'success': false, 'message': "NO MERCHANTS", 'data': null };
  }
  
  const addRandomCardResult = await context.functions.execute("test_addRandomCard");
  var newCard = addRandomCardResult.data;
  
   if (!newCard) {
    return { 'success': false, 'message': "test_addRandomCard fatal error", 'data': null };
  }
  
  var cards = merchant.cards;
  if (!cards) {
    cards = [];
  }
  cards.push(newCard);
  
  const update = {
    "$set": {
      "cards": cards
    }
  };
    
  const query = { "_id": merchant._id };
  const options = { "upsert": false };
  
  await merchants.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated merchant`);
      }
    })
    .catch(err => console.error(`Failed to update merchant: ${err}`));
    
  // set associated merchant to card
  const setAssociatedMerchantToCardResult = await context.functions.execute("utils_setAssociatedMerchantToCard", newCard.number, merchant.userId);
  console.log('utils_setAssociatedMerchantToCard: ', setAssociatedMerchantToCardResult);
  
  return { 'success': true, 'message': "add random card to merchant success", 'data':  { 'card': newCard, 'merchant': merchant } };
};
//exports();
//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'));