exports = async function(userId){
  // add new user to DB
  const cluster = context.services.get("mongodb-atlas");
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query = { 'userId': userId };
		
	var cardholder;
  await cardholders.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found cardholder: ${result}.`);
        cardholder = result
      } else {
        console.log("No cardholder matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the cardholder: ${err}`))
    
  return cardholder;
};

//exports(new BSON.ObjectId('62d397d39f467f7f9eaccb99'))
