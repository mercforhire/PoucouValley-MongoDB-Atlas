exports = async function(userId, { notification }) {
  var user = await context.functions.execute("utils_getUserById", userId);
  if (!user) {
    return {
      'success': false,
      'message': 'USER_DOESNT_EXIST',
      'data': userId
    };
  }
  
  const settings = { notification };
  const query = { "_id": userId };
  const update = {
    "$set": {
      "settings": settings
    }
  };
  const options = { "upsert": false };

  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("users");
  await collection.updateOne(query, update, options)
    .then(result => {
      const {
        matchedCount,
        modifiedCount
      } = result;
      if (matchedCount && modifiedCount) {
        console.log(`Successfully updated user settings`);
      }
    })
    .catch(err => console.error(`Failed to update user settings: ${err}`));
  
  return {
    'success': true,
    'message': "utils_setUserSettings SUCCESS",
    'data': settings
  };
};

//exports(new BSON.ObjectId('62dbcf879f467f7f9ece0015'), "M-101778-Z")