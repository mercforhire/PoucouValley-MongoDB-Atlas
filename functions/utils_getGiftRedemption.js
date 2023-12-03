exports = async function(redemptionId){
  const cluster = context.services.get("mongodb-atlas");
  const redemptions = cluster.db("poucouValley").collection("giftRedemptions");
  const query = { '_id': redemptionId };
		
	var redemption;
  await redemptions.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found redemption: ${result}.`);
        redemption = result
      } else {
        console.log("No redemption matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the redemption: ${err}`))
    
  return redemption;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))