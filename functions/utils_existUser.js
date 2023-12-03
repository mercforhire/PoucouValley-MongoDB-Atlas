exports = async function(email){
  var verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("poucouValley").collection("users");
  const query = { "email": email };
			
  var exist = false;
  await users.count(query)
    .then(count => {
      console.log(`Successfully found ${count} users.`)
      exist = count > 0;
    })
    .catch(err => console.error(`Failed to find verifyCodes: ${err}`))
  return exist;
};

//exports('feiyangca@yahoo.ca')