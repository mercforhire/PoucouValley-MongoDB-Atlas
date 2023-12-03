exports = async function(email) {
  email = email.toLowerCase()
  
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { "email": email };
	
	var success = false
  await users.count(query)
    .then(count => {
      console.log(`Successfully found ${count} user with the email.`)
      success = count == 0;
    })
    .catch(err => console.error(`Failed to find user: ${err}`))
    
  if (success) {
    return { 'success': true, 'message': 'EMAIL_AVAILABLE', 'data': email };
  } else {
    return { 'success': false, 'message': 'EMAIL_ALREADY_USED', 'data': null };
  }
};

//exports('feiyangca@yahoo.ca')