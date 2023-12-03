exports = async function(email, code) {
  const cluster = context.services.get("mongodb-atlas");
  const verifyCodes = cluster.db("poucouValley").collection("verifyCodes");
  const query = { "email": email, "code": code };
	var found = false;
  await verifyCodes.count(query)
    .then(count => {
      console.log(`Successfully found ${count} verifyCodes.`)
      found = count > 0;
    })
    .catch(err => console.error(`Failed to find verifyCodes: ${err}`))
  return { 'success': true, 'message': found ? 'CODE_VALID' : 'CODE NOT FOUND', 'data': found }
};

//exports('feiyangca@yahoo.ca', '1234')