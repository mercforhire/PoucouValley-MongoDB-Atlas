exports = async function(clientId, { cardholderUserId, firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email }) {
  // check if client exist
  var existClient = await context.functions.execute("utils_getClient", clientId);
  if (!existClient) {
    return { 'success': false, 'message': 'CLIENT_DOES_NOT_EXIST', 'data': clientId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const clients = cluster.db("poucouValley").collection("clients");
  const query = { "_id": clientId };
  const options = { "upsert": false };
  
  if (cardholderUserId) {
    const update = {
      "$set": {
        "cardholderUserId": cardholderUserId
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated cardholderUserId`)
        }
      })
      .catch(err => console.error(`Failed to update firstName: ${err}`))
  }
  
  if (firstName) {
    const update = {
      "$set": {
        "firstName": firstName
      }
    };
    
    await clients.updateOne(query, update, options)
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
    
    await clients.updateOne(query, update, options)
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
    
    await clients.updateOne(query, update, options)
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
    
    await clients.updateOne(query, update, options)
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
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated birthday`)
        }
      })
      .catch(err => console.error(`Failed to update birthday: ${err}`))
  }
  
  if (address) {
    const update = {
      "$set": {
        "address": address
      }
    };
    
    await clients.updateOne(query, update, options)
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
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated avatar`)
        }
      })
      .catch(err => console.error(`Failed to update avatar: ${err}`))
  }
  
  if (company) {
    const update = {
      "$set": {
        "company": company
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated company`)
        }
      })
      .catch(err => console.error(`Failed to update company: ${err}`))
  }
  
  if (jobTitle) {
    const update = {
      "$set": {
        "jobTitle": jobTitle
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated jobTitle`)
        }
      })
      .catch(err => console.error(`Failed to update jobTitle: ${err}`))
  }
  
  if (hashtags) {
    const update = {
      "$set": {
        "hashtags": hashtags
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated hashtags`)
        }
      })
      .catch(err => console.error(`Failed to update hashtags: ${err}`))
  }
  
  if (notes) {
    const update = {
      "$set": {
        "notes": notes
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated notes`)
        }
      })
      .catch(err => console.error(`Failed to update notes: ${err}`))
  }
  
  if (email) {
    const update = {
      "$set": {
        "email": email
      }
    };
    
    await clients.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated email`)
        }
      })
      .catch(err => console.error(`Failed to update email: ${err}`))
  }
  
  // get the updated cardholder
  await clients.findOne(query)
    .then(result => {
      if(result) {
        console.log(`Successfully found client: ${result}.`);
        existClient = result;
      } else {
        console.log("No client matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to update the client: ${err}`))
  
  return { 'success': true, 'message': "client edited", 'data': existClient };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })