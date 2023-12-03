exports = async function(cardNumber) {
  const cluster = context.services.get("mongodb-atlas");
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
    .catch(err => console.error(`Failed to find cardholder: ${err}`));
    
  return existingCardholder
};

//exports('1234567890')