exports = async function(merchantId) {
  var merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  console.log('merchant: ' + merchant);
  if (!merchant) {
    return {
      'success': false,
      'message': 'MERCHANT_DOES_NOT_EXIST',
      'data': merchantId
    };
  }
  
  const user = await context.functions.execute('utils_getUserById', merchant.userId);
  if (!user) {
    return { 'success': false, 'message': "USER NOT FOUND", 'data': null };
  }

  const { faker } = require('@faker-js/faker');
  
  const name = faker.company.companyName();
  const field = await context.functions.execute("test_getRandomBusinessType");
  const randomLogoUrl = await context.functions.execute('test_randomPhoto');
  const logo = {
    "thumbnailUrl": randomLogoUrl,
    "fullUrl": randomLogoUrl
  };
  const address = {
    unitNumber: faker.random.numeric(2),
    streetNumber: faker.address.buildingNumber(),
    street: faker.address.streetName(),
    city: faker.address.city(),
    province: faker.address.state(),
    country: faker.address.country(),
    postalCode: faker.address.zipCode()
  };
  const contact = {
    email: user.email,
    phoneAreaCode: "1",
    phoneNumber: faker.phone.phoneNumber('###-###-####'),
    website: faker.internet.url(),
    twitter: faker.internet.userName(),
    facebook: faker.internet.url(),
    instagram: faker.internet.userName()
  };
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
  const description = faker.commerce.productDescription();
  const hashtags = [];
  const hashtagsCount = Math.floor(Math.random() * 11) + 1;
  for (let i = 0; i < hashtagsCount; i++) {
    const hashword = faker.company.bsBuzz();
    hashtags.push(hashword);
  }
  
  const response = await context.functions.execute("api_updateMerchantInfo", user.apiKey, { name, field, logo, photos, contact, address, description, hashtags });
  
  return {
    'success': true,
    'message': "test_setup_merchant SUCCESS",
    'data': merchant
  };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))