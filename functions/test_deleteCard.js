exports = async function(cardNumber, cardPin) {
  const cluster = context.services.get("mongodb-atlas");
  
  // check if card exist
  const checkCardAndPinResult = await context.functions.execute("utils_checkCardAndPin", cardNumber, cardPin);
  const cardAndPinValid = checkCardAndPinResult.success;
  if (!cardAndPinValid) {
    return { 'success': false, 'message': 'CARD_PIN_INVALID', 'data': null };
  }
  
  // delete the card from cardholders
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query = { 'card': cardNumber };
  const update = {
      "$set": {
        "card": null
      }
    };
  const options = { "upsert": false };
  await cardholders.updateMany(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated ${modifiedCount} cardholders`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`))
  
  // delete the card from merchants
  const merchants = cluster.db("poucouValley").collection("merchants");
  await merchants.updateMany({}, { '$pull': { 'cards' : { '$in' : [ cardNumber ] } }})
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated ${modifiedCount} merchants`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`))  

  // delete the card from cards
  const cards = cluster.db("poucouValley").collection("cards");
  const query2 = { 'number': cardNumber };
  await cards.deleteMany(query2)
    .then(result => {
      const { deletedCount } = result;
      if (deletedCount) {
        console.log(`Successfully deleted ${deletedCount} cards`)
      }
    })
    .catch(err => console.error(`Failed to delete: ${err}`))
  
  return { 'success': true, 'message': "DELETE SUCCESS", 'data': null };
};

// exports('12345678901', '123')

