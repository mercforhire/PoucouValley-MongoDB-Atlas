exports = async function(merchantId) {
  var merchant;
  
  if (!merchantId) {
    // pick a random merchant
    merchant = await context.functions.execute("test_getRandomMerchant");
    console.log('merchant: ' + merchant);
    if (!merchant) {
      return { 'success': false, 'message': 'NO_MERCHANTS', 'data': null };
    }
  } else {
    merchant = await context.functions.execute("utils_getMerchantById", merchantId);
    console.log('merchant: ' + merchant);
    if (!merchant) {
      return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
    }
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const clientsCollection = cluster.db("poucouValley").collection("clients");
	const { faker } = require('@faker-js/faker');
	
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const gender = faker.name.gender(true);
  const pronoun = gender == "Male" ? "He" : "She";
  
  const randomDate = faker.date.between('1970-01-01T00:00:00.000Z', '2012-01-01T00:00:00.000Z');
  const month = randomDate.getUTCMonth() + 1; //months from 1-12
  const day = randomDate.getUTCDate();
  const year = randomDate.getUTCFullYear();
  const birthday = { 
    day: day,
    month: month,
    year: year 
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
    website: faker.internet.url(),
    facebook: faker.internet.url(),
    instagram: faker.internet.url(),
    phoneAreaCode: '1',
    phoneNumber: faker.phone.phoneNumber('#########'),
    twitter: faker.internet.url(),
  };
  
  const thumbnailUrl = await context.functions.execute('test_randomPhoto');
  const fullUrl = await context.functions.execute('test_randomPhoto');
  const avatar = { thumbnailUrl, fullUrl };
  
  const company = faker.company.companyName();
  const jobTitle = faker.name.jobTitle();
  const hashtags = [];
  const hashtagsCount = Math.floor(Math.random() * 11) + 1;
  for (let i = 0; i < hashtagsCount; i++) {
    const hashword = faker.company.bsBuzz();
    hashtags.push(hashword);
  }
  const notes = faker.lorem.paragraph();
  const email = faker.internet.email();
  
  const result = await context.functions.execute("utils_addClient", merchant.userId, { firstName, lastName, pronoun, gender, birthday, address, avatar, company, jobTitle, hashtags, notes, email, contact });
  const newClient = result.data;
  
  return { 'success': true, 'message': "client inserted", 'data': newClient };
};

//exports(new BSON.ObjectId('62d2fec69f467f7f9e50c8e9'))


