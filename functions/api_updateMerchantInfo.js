exports = async function(apiKey, { name, field, logo, photos, contact, address, cards, description, hashtags }) {
  // check if apiKey valid
  var merchantUserId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!merchantUserId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
	
	var merchant = await context.functions.execute("utils_getMerchantById", merchantUserId);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_NOT_FOUND', 'data': null };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  const query = { "userId": merchantUserId };
  const options = { "upsert": false };
  
  if (name) {
    const update = {
      "$set": {
        "name": name
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated firstName`)
        }
      })
      .catch(err => console.error(`Failed to update firstName: ${err}`))
  }
  
  if (field) {
    const update = {
      "$set": {
        "field": field
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated field`)
        }
      })
      .catch(err => console.error(`Failed to update field: ${err}`))
  }
  
  if (description) {
    const update = {
      "$set": {
        "description": description
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated description`)
        }
      })
      .catch(err => console.error(`Failed to update description: ${err}`))
  }
  
  if (logo) {
    const update = {
      "$set": {
        "logo": logo
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated logo`)
        }
      })
      .catch(err => console.error(`Failed to update logo: ${err}`))
  }
  
  if (photos) {
    const update = {
      "$set": {
        "photos": photos
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated photos`)
        }
      })
      .catch(err => console.error(`Failed to update photos: ${err}`))
  }
  
  if (contact) {
    const update = {
      "$set": {
        "contact": contact
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated contact`)
        }
      })
      .catch(err => console.error(`Failed to update contact: ${err}`))
  }
  
  if (address) {
    const update = {
      "$set": {
        "address": address
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated address`)
        }
      })
      .catch(err => console.error(`Failed to update address: ${err}`))
  }
  
  if (cards) {
    const update = {
      "$set": {
        "cards": cards
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated cards`)
        }
      })
      .catch(err => console.error(`Failed to update cards: ${err}`))
  }
  
  if (hashtags) {
    const update = {
      "$set": {
        "hashtags": hashtags
      }
    };
    
    await merchants.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated hashtags`)
        }
      })
      .catch(err => console.error(`Failed to update hashtags: ${err}`))
  }
  
  // get the updated merchant
  await merchants.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found merchant: ${result}.`);
        merchant = result
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))

  return { 'success': true, 'message': 'UPDATE MERCHANT INFO SUCCESS', 'data': merchant } ;
};
