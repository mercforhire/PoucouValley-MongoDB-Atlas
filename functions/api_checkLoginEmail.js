exports = async function(email) {
  email = email.toLowerCase()
  
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { "email": email };
	
	var found;
  await users.count(query)
    .then(count => {
      console.log(`Successfully found ${count} user.`);
      found = count > 0;
    })
    .catch(err => console.error(`Failed to find user: ${err}`))
    
  return { 'success': found, 'message': found ? "EMAIL_EXIST" : "USER_NOT_FOUND", 'data': found };
};

//exports('feiyangca@yahoo.ca')