exports = async function(){
  const cluster = context.services.get("mongodb-atlas");
  const businessTypes = cluster.db("poucouValley").collection("businessTypes");
	
	var types;
  await businessTypes.find()
    .sort( { "order": 1 } )
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found business types: ${result}.`);
        types = result
      } else {
        console.log("No business types.");
      }
    })
    .catch(err => {
      console.error(`Failed to fetch the business types: ${err}`);
      return { 'success': false, 'message': `Failed to fetch the business types: ${err}`, 'data': null };
    })
    
  return { 'success': true, 'message': 'FETCH_SUCCESSFUL', 'data': types };
};
