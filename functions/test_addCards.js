exports = async function(startCardNumber, endCardNumber) {
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
  const { faker } = require('@faker-js/faker');
  
  var addedCards = [];
  for (let i = startCardNumber; i <= endCardNumber; i++) {
    console.log('card number:', i);
    
    const params = { 
        "number": `A-${i}-A`,
        "pin": faker.random.numeric(3),
      };
  		
  	var insertedId;
    await cards.insertOne(params)
      .then(result => {
        insertedId = result.insertedId;
        console.log(`Successfully inserted.`)
      })
      .catch(err => console.error(`Failed to insert: ${err}`))
      
    const newCard = await context.functions.execute("utils_getCardById", insertedId);
    addedCards.push(newCard);
  }
	
  return { 'success': true, 'message': "ADD SUCCESS", 'data': addedCards };
};
