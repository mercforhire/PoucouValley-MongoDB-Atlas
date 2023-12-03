exports = async function(cardNumber, code) {
  const cluster = context.services.get("mongodb-atlas");
  
  // check if the card existing
  const card = await context.functions.execute("utils_getCardByNumber", cardNumber, code);
  if (!card) {
    return { 'success': false, 'message': 'CARD_NOT_EXIST', 'data': null }
  }
  
  // check card code is correct
  const card2 = await context.functions.execute("utils_checkCardAndPin", cardNumber, code);
  if (!card2) {
    return { 'success': false, 'message': 'CARD_PIN_INCORRECT', 'data': null }
  }
  
  // check if the card is already used
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query = { "card": cardNumber };
	var existingCardholder;
  await cardholders.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholder: ${result}`)
        existingCardholder = result
      } else {
        console.log("No cardholder matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find cardholder: ${err}`))
  if (existingCardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_ALREADY_EXIST', 'data': null }
  }
  
  return { 'success': true, 'message': 'CARD AVAILIABLE', 'data': cardNumber } ;
};

//exports('1234567890', '123', 'feiyangca1@yahoo.ca')