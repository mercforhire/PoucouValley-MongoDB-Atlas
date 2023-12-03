exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("merchants");
	const query = {};
	
	var objects;
  await collection.find()
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found objects: ${result.length}.`);
        objects = result
      } else {
        console.log("No plans.");
      }
    })
    .catch(err => {
      console.error(`Failed to fetch the objects: ${err}`);
      return { 'success': false, 'message': `Failed to fetch objects: ${err}`, 'data': null };
    })
  
  const { faker } = require('@faker-js/faker');
  
  for (const object of objects) {
    const photosCount = Math.floor(Math.random() * 8) + 1;
    var randomPhoto;
    for (let i = 0; i < photosCount; i++) {
      const randomPhotoUrl = await context.functions.execute('test_randomPhoto');
      if (!randomPhotoUrl) {
        continue;
      }
      randomPhoto = {
        "thumbnailUrl": randomPhotoUrl,
        "fullUrl": randomPhotoUrl
      };
      break;
    }
    const update = {
      "$set": {
        "logo": randomPhoto
      }
    };
    const query2 = { "_id": object._id };
    const options = { "upsert": false };
    await collection.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated photos`)
        }
      })
      .catch(err => console.error(`Failed to update photos: ${err}`))
  }
  
  return {
    'success': true,
    'message': "test_fix_gifts SUCCESS",
    'data': null
  };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))