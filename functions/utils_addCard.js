exports = async function(cardNumber) {
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
	const { faker } = require('@faker-js/faker');
	
	var params;
	if (cardNumber) {
	  params = { 
      "number": cardNumber,
      "pin": faker.random.numeric(3),
    };
	} else {
	  return { 'success': false, 'message': "CARD NUMBER EMPTY", 'data': cardNumber };
	}
		
	var insertedId;
  await cards.insertOne(params)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted.`)
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  const newCard = await context.functions.execute("utils_getCardById", insertedId);
  
  return { 'success': true, 'message': "ADD CARD SUCCESS", 'data': newCard };
};
