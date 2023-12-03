exports = async function(email) {
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { 'email': email };
	
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
    .catch(err => console.error(`Failed to update the item: ${err}`))
    
  return user;
};

//exports('feiyangca@yahoo.ca')