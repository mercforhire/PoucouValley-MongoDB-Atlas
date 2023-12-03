exports = async function(objectId){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("accountDeletionRequests");
  const query = { '_id': objectId };
		
	var newObject;
  await collection.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found object: ${result}.`);
        newObject = result
      } else {
        console.log("No object matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return newObject;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))