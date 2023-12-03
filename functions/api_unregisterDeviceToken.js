exports = async function(apiKey, { deviceToken }) {
  // check if apiKey valid
  var user = await context.functions.execute("utils_getUserByAPIKey", apiKey);
  if (!user) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  var deviceTokens = user.deviceTokens;
  if (deviceTokens == null) {
    deviceTokens = [];
  }
  const index = deviceTokens.filter((element) => element.deviceToken === deviceToken);
  if (index > -1) { // only splice array when item is found
    await context.functions.execute("twilio_remove_device_from_identity", deviceTokens[index].sid);
    deviceTokens.splice(index, 1); // 2nd parameter means remove one item only
  } else {
    return { 'success': true, 'message': "device token never existed for user", 'data': deviceToken };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("users");
  const query = { '_id': user._id };
  const update = {
    "$set": {
      "deviceTokens": deviceTokens
    }
  };
  const options = { "upsert": false };

  await collection.updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated deviceTokens`)
        }
    })
    .catch(err => console.error(`Failed to update deviceTokens: ${err}`))
    
  user = await context.functions.execute("utils_getUserByAPIKey", apiKey);
  
	return { 'success': true, 'message': "device token removed for user", 'data': deviceTokens };
};

//exports('3cf8e4693d767ca2234f2a122bc3977e24202fd4b4c56c1144f8604e2124da442b12ee4be527b37bd1273ef1198880282ac3c1dee94597f551035318b082b797', { deviceToken: "e3badd2d1018153bd6963cee5fee0a0b7ac7d845a4a6ba99aed28940da86630d" });

