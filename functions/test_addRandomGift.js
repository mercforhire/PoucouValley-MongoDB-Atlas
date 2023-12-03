exports = async function() {
  // add a random gift
  const { faker } = require('@faker-js/faker');
  
  const createdDate = new Date();
  const name = faker.commerce.product();
  const costInCoins = faker.datatype.number({ min: 50, max: 1000 })
  const description = faker.commerce.productAdjective();
  const description2 = faker.commerce.productDescription();
  
  const photosCount = Math.floor(Math.random() * 11) + 1;
  var photos = [];
  for (let i = 0; i < photosCount; i++) {
    const randomPhotoUrl = await context.functions.execute('test_randomPhoto');
    if (!randomPhotoUrl) {
      continue;
    }
    const randomPhoto = {
      "thumbnailUrl": randomPhotoUrl,
      "fullUrl": randomPhotoUrl
    };
    photos.push(randomPhoto);
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const gifts = cluster.db("poucouValley").collection("gifts");
  const newItem = {
    "createdDate": createdDate,
    "name": name,
    "costInCoins": costInCoins,
    "description": description,
    "description2": description2,
    "photos": photos
  };
  var insertedId;
  await gifts.insertOne(newItem)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted random gift.`)
    })
    .catch(err => console.error(`Failed to insert random promotion: ${err}`))
    
  const newGift = await context.functions.execute("utils_getGift", insertedId);
  return { 'success': true, 'message': "gift inserted", 'data': newGift };
};
