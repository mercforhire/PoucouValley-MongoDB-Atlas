exports = async function(email) {
  const cluster = context.services.get("mongodb-atlas");
  const verifyCodes = cluster.db("poucouValley").collection("verifyCodes");
  const query = { "email": email };
	var code;
  await verifyCodes.findOne(query)
    .then(result => {
      console.log(`Successfully found ${result}`)
      code = result.code;
    })
    .catch(err => console.error(`Failed to find verifyCodes: ${err}`))
  return code;
};

//exports('feiyangca@yahoo.ca', '1234')