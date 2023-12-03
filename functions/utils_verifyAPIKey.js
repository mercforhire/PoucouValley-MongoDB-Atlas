exports = async function(apiKey) {
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { 'apiKey': apiKey };
	
	var userId = null;
  await users.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found user: ${result}.`);
        userId = result._id;
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`))
    
  return userId;
};

//exports('51e78fc743970142986be7952bd71591f2675e4158d8003225e7fab3c1da297d32a81190eca15f039a96eec153a7eb375ed77ecab2772979e81beef00a678212')