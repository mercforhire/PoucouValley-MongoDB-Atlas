exports = async function(cardNumber) {
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
  const query = { 'number': cardNumber };
	
	var card;
  await cards.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found card: ${result}.`);
        card = result
      } else {
        console.log("No card matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find the item: ${err}`))
    
  return card;
};

//exports('1234567890')