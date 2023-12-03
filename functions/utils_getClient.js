exports = async function(objectId){
  const cluster = context.services.get("mongodb-atlas");
  const clients = cluster.db("poucouValley").collection("clients");
  const query = { '_id': objectId };
		
	var object;
  await clients.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        object = result
      } else {
        console.log("No matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return object;
};

//exports(new BSON.ObjectId('627202c668d0c59a37664712'))