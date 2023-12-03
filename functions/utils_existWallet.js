exports = async function(userId){
  const cluster = context.services.get("mongodb-atlas");
  const wallets = cluster.db("poucouValley").collection("wallets");
  const query = { "userId": userId };
		
	var exist = false;
  await wallets.count(query)
    .then(count => {
      console.log(`Successfully found ${count} wallets.`)
      exist = count > 0;
    })
    .catch(err => console.error(`Failed to find wallet: ${err}`))
    
  return exist;
};

//exports(new BSON.ObjectId('62717ca350ac436de2e534bf'))