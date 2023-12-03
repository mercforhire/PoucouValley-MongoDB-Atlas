exports = async function(apiKey, { firstName, lastName, pronoun, gender, birthday, contact, address, avatar, interests }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  const query1 = { 'userId': userId };
	
	var user;
  await cardholders.findOne(query1)
    .then(result => {
      if(result) {
        console.log(`Successfully found user: ${result}.`);
        user = result
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
    
  if (!user) {
    return { 'success': false, 'message': 'CARDHOLDER NOT FOUND', 'data': null };
  }
  
  const query2 = { "userId": userId };
  const options = { "upsert": false };
  
  if (firstName) {
    const update = {
      "$set": {
        "firstName": firstName
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated firstName`)
        }
      })
      .catch(err => console.error(`Failed to update firstName: ${err}`))
  }
  
  if (lastName) {
    const update = {
      "$set": {
        "lastName": lastName
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated lastName`)
        }
      })
      .catch(err => console.error(`Failed to update lastName: ${err}`))
  }
  
  if (pronoun) {
    const update = {
      "$set": {
        "pronoun": pronoun
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated pronoun`)
        }
      })
      .catch(err => console.error(`Failed to update pronoun: ${err}`))
  }
  
  if (gender) {
    const update = {
      "$set": {
        "gender": gender
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated gender`)
        }
      })
      .catch(err => console.error(`Failed to update gender: ${err}`))
  }
  
  if (birthday) {
    const update = {
      "$set": {
        "birthday": birthday
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated birthday`)
        }
      })
      .catch(err => console.error(`Failed to update birthday: ${err}`))
  }
  
  if (contact) {
    const update = {
      "$set": {
        "contact": contact
      }
    };
    
    await cardholders.updateOne(query2, update, options)
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
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated address`)
        }
      })
      .catch(err => console.error(`Failed to update address: ${err}`))
  }
  
  if (avatar) {
    const update = {
      "$set": {
        "avatar": avatar
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated avatar`)
        }
      })
      .catch(err => console.error(`Failed to update avatar: ${err}`))
  }
  
  if (interests) {
    const update = {
      "$set": {
        "interests": interests
      }
    };
    
    await cardholders.updateOne(query2, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated interests`)
        }
      })
      .catch(err => console.error(`Failed to update interests: ${err}`))
  }
  
  // get the updated cardholder
  await cardholders.findOne(query1)
    .then(result => {
      if(result) {
        console.log(`Successfully found user: ${result}.`);
        user = result
      } else {
        console.log("No user matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
  
  return { 'success': true, 'message': 'UPDATE_CARDHOLDER_INFO_SUCCESS', 'data': user } ;
};