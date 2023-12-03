exports = async function(id){
  // add new user to DB
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("visitRecords");
  const query = { '_id': id };
		
	var newElement;
  await collection.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        newElement = result
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`))
    
  return newElement;
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'))