exports = async function(userId){
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query = { 'userId': userId };
		
	var wallet;
  await wallets.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found wallet: ${result}.`);
        wallet = result
      } else {
        console.log("No wallet matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the wallet: ${err}`))
    
  return wallet;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))