exports = async function(){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("poucouCardBulletPoints");
	
	var points;
  await collection.find()
    .sort( { "order": 1 } )
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result}.`);
        points = result
      } else {
        console.log("No bullet points.");
      }
    })
    .catch(err => {
      console.error(`Failed to fetch the bullet pointss: ${err}`);
      return { 'success': false, 'message': `Failed to fetch the bullet points: ${err}`, 'data': null };
    })
    
  return { 'success': true, 'message': 'FETCH_SUCCESSFUL', 'data': points };
};
