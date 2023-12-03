exports = async function() {
  // pick a random merchant
  const randomMerchant = await context.functions.execute('test_getRandomMerchant');
  if (!randomMerchant) {
    return { 'success': false, 'message': "NO MERCHANTS", 'data': null };
  }
  
  const user = await context.functions.execute('utils_getUserById', randomMerchant.userId);
  if (!user) {
    return { 'success': false, 'message': "USER NOT FOUND", 'data': null };
  }
  
  // add a random plan
  const { faker } = require('@faker-js/faker');
  
  const createdDate = new Date();
  const merchant = randomMerchant._id;
  const title = faker.commerce.product();
  const description = faker.commerce.productDescription();
  const photosCount = Math.floor(Math.random() * 8) + 1;
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
  const price = parseFloat(faker.commerce.price());
  const discountedPrice = price * 0.7;
  const hashtags = [];
  const hashtagsCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < hashtagsCount; i++) {
    const hashword = faker.company.bsBuzz();
    hashtags.push(hashword);
  }
  
  const newPlanResponse = await context.functions.execute("api_addPlan", user.apiKey, { title, description, photos, price, discountedPrice, hashtags });
  return newPlanResponse;
};
