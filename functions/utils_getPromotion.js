exports = async function(promotionId){
  const cluster = context.services.get("mongodb-atlas");
  const promotions = cluster.db("poucouValley").collection("promotions");
  const query = { '_id': promotionId };
		
	var promotion;
  await promotions.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found promotion: ${result}.`);
        promotion = result
      } else {
        console.log("No promotion matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return promotion;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))