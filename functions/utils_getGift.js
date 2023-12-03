exports = async function(giftId){
  const cluster = context.services.get("mongodb-atlas");
  const gifts = cluster.db("poucouValley").collection("gifts");
  const query = { '_id': giftId };
		
	var gift;
  await gifts.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found gift: ${result}.`);
        gift = result
      } else {
        console.log("No gift matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the gift: ${err}`))
    
  return gift;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))