exports = async function() {
  // pick a random merchant
  const cluster = context.services.get("mongodb-atlas");
  const merchants = cluster.db("poucouValley").collection("merchants");
  
  var randomMerchant;
  await merchants.find({})
    .toArray()
    .then(results => {
      if(results) {
        console.log(`Successfully found merchants: ${results}`);
        randomMerchant = results[Math.floor(Math.random()*results.length)];
      } else {
        console.log("No empty merchants matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query empty merchants: ${err}`));
  
  if (!randomMerchant) {
    return { 'success': false, 'message': "NO MERCHANTS", 'data': null };
  }
  
  // add a random plan
  const { faker } = require('@faker-js/faker');
  
  const createdDate = new Date();
  const merchant = randomMerchant._id;
  const title = faker.commerce.product();
  const description = faker.commerce.productDescription();
  const price = faker.commerce.price();
  const discountedPrice = price * 0.7;
  const hashtags = [];
  const hashtagsCount = Math.floor(Math.random() * 11) + 1;
  for (let i = 0; i < hashtagsCount; i++) {
    const hashword = faker.company.bsBuzz();
    hashtags.push(hashword);
  }
  
  const photosCount = Math.floor(Math.random() * 11) + 1;
  var photos = [];
  for (let i = 0; i < photosCount; i++) {
    const randomPhoto = await context.functions.execute('test_randomPhoto');
    photos.push(randomPhoto);
  }
  
  const promotions = cluster.db("poucouValley").collection("promotions");
  const newItem = {
    "createdDate": createdDate,
    "merchant": merchant,
    "title": title,
    "description": description,
    "photos": photos,
    "price": price,
    "discountedPrice": discountedPrice,
    "hashtags": hashtags
  };
  var insertedId;
  await promotions.insertOne(newItem)
    .then(result => {
      insertedId = result.insertedId;
      console.log(`Successfully inserted random promotion.`)
    })
    .catch(err => console.error(`Failed to insert random promotion: ${err}`))
    
  const newPromotion = await context.functions.execute("utils_getPromotion", insertedId);
  return { 'success': true, 'message': "promotion inserted", 'data': newPromotion };
};
