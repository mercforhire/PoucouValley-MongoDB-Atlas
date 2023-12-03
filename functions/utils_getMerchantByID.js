exports = async function(userId){
  // add new user to DB
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  const query = { 'userId': userId };
		
	var merchant;
  await merchants.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found merchant: ${result}.`);
        merchant = result
      } else {
        console.log("No merchant matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find merchant: ${err}`))
    
  return merchant;
};

//exports(new BSON.ObjectId('626f2a9e50ac436de2a3eef9'))