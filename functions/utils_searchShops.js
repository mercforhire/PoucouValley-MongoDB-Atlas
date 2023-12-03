exports = async function(keyword, category) {
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  const query = { "name": { '$regex': keyword, $options: 'i' } };
  var query2 = {};
	if (category != undefined && category) {
    query2 = { 'field': category };
  }
  
	var results;
  await merchants.find({
      $and: [
            { $or: [ query ] }, 
            query2
          ]
      })
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found merchants: ${result}.`);
        results = result
      } else {
        console.log("No merchant matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to find the merchant: ${err}`))
    
  return results;
};