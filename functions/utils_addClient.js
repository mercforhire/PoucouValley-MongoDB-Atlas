exports = async function(merchantId, { cardholderUserId, firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact }) {
  // check if merchant exist
  const existMerchant = await context.functions.execute("utils_getMerchantById", merchantId);
  if (!existMerchant) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const clientsCollection = cluster.db("poucouValley").collection("clients");
			
  const newClientParams = { 
    'createdDate': new Date(),
    'ownerId': merchantId,
    'cardholderUserId': cardholderUserId,
    'firstName': firstName, 
    'lastName': lastName, 
    'pronoun': pronoun, 
    'gender': gender, 
    'birthday': birthday, 
    'address': address, 
    'avatar': avatar, 
    'company': company, 
    'jobTitle': jobTitle, 
    'hashtags': hashtags, 
    'notes': notes,
    'email': email,
    'contact': contact
  };
		
	var insertedId;
  await clientsCollection.insertOne(newClientParams)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted client.`)
    })
    .catch(err => console.error(`Failed to insert client: ${err}`))
    
  const newClient = await context.functions.execute("utils_getClient", insertedId);
  
  return { 'success': true, 'message': "client inserted", 'data': newClient };
};

//exports(new BSON.ObjectId('626eee7b50ac436de219da89'), { title: "Promotion 1", description: "Buy this one!", photos: [], price: 10.00, discountedPrice: 7.00, hashtags: ['a','b','c'] })