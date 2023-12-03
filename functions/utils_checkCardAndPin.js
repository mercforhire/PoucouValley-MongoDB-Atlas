exports = async function(cardNumber, code){
  // check card code is correct
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
  const query = { "number": cardNumber, "pin": code };
  var card;
  await cards.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found card with pin: ${result}`)
        card = result
      } else {
        console.log("No card matches the provided pin.");
      }
    })
    .catch(err => console.error(`Failed to find card: ${err}`))
  
  return card;
};

//exports('1234567890', '123')