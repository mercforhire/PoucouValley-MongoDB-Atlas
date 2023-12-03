exports = async function(planId, { title, description, photos, price, discountedPrice, hashtags }) {
  // check if plan exist
  var plan = await context.functions.execute("utils_getPlan", planId);
  if (!plan) {
    return { 'success': false, 'message': 'PLAN_DOES_NOT_EXIST', 'data': planId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("plans");
  const query = { "_id": planId };
  const options = { "upsert": false };
  
  if (title) {
    const update = {
      "$set": {
        "title": title
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated title`)
        }
      })
      .catch(err => console.error(`Failed to update title: ${err}`))
  }
  
  if (description) {
    const update = {
      "$set": {
        "description": description
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated description`)
        }
      })
      .catch(err => console.error(`Failed to update description: ${err}`))
  }
  
   if (photos) {
    const update = {
      "$set": {
        "photos": photos
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated photos`)
        }
      })
      .catch(err => console.error(`Failed to update photos: ${err}`))
  }
  
  if (price != null && price > 0) {
    const update = {
      "$set": {
        "price": price
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated price`)
        }
      })
      .catch(err => console.error(`Failed to update price: ${err}`))
  }
  
  if (discountedPrice != null && discountedPrice > 0) {
    const update = {
      "$set": {
        "discountedPrice": discountedPrice
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated discountedPrice`)
        }
      })
      .catch(err => console.error(`Failed to update discountedPrice: ${err}`))
  }
  
  if (hashtags) {
    const update = {
      "$set": {
        "hashtags": hashtags
      }
    };
    
    await collection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated hashtags`)
        }
      })
      .catch(err => console.error(`Failed to update hashtags: ${err}`))
  }
  
  // get the updated plan
  await collection.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found client: ${result}.`);
        plan = result;
      } else {
        console.log("No client matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the client: ${err}`))
  
  return { 'success': true, 'message': "plan edited", 'data': plan };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })