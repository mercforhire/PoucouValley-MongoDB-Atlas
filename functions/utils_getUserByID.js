exports = async function(userId) {
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { '_id': userId };
	
	var user;
  await users.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found user: ${result}.`);
        user = result
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return user;
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'))