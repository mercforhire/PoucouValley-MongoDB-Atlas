exports = async function(objectId){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("transactions");
  const query = { '_id': objectId };
		
	var document;
  await collection.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found : ${result}.`);
        document = result
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return document;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))