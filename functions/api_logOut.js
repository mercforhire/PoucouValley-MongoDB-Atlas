exports = async function(apiKey){
  // check if apiKey valid
  var user = await context.functions.execute("utils_getUserByAPIKey", apiKey);
  if (!user) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const verifyCodes = cluster.db("poucouValley").collection("verifyCodes");
  const query = { 'email': user.email };

  var success = false;
  await verifyCodes.deleteMany(query)
    .then(result => {
      const { deletedCount } = result;
      if (deletedCount) {
        console.log(`Successfully deleted ${deletedCount} verify codes`)
        success = true;
      }
    })
    .catch(err => console.error(`Failed to delete: ${err}`))
    
	return { 'success': success };
};

//exports('feiyangca@yahoo.ca')