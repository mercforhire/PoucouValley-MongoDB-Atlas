exports = async function(cardNumber, pin) {
  const cluster = context.services.get("mongodb-atlas");
  const cards = cluster.db("poucouValley").collection("cards");
	
	var params;
	if (cardNumber && pin) {
	  params = { 
      "number": cardNumber,
      "pin": pin,
    };
	} else {
	  const { faker } = require('@faker-js/faker');
	
    params = { 
      "number": `${faker.random.alpha({ count: 1, upcase: true })}-${faker.random.numeric(6)}-${faker.random.alpha({ count: 1, upcase: true })}`,
      "pin": faker.random.numeric(3),
    };
	}
		
	var insertedId;
  await cards.insertOne(params)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted.`)
    })
    .catch(err => console.error(`Failed to insert: ${err}`))
    
  const newCard = await context.functions.execute("utils_getCardById", insertedId);
  
  return { 'success': true, 'message': "ADD SUCCESS", 'data': newCard };
};
