exports = async function(clientId) {
  var client;
  if (clientId) {
    client = await context.functions.execute("utils_getClient", clientId);
  } else {
    client = await context.functions.execute("test_getRandomClient");
  }
  if (!client) {
    return { 'success': false, 'message': 'NO_CLIENTS_EXIST', 'data': null };
  }

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
    phoneNumber: faker.phone.phoneNumber('##########'),
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

  const result = await context.functions.execute("utils_editClient", client._id, {
    firstName,
    lastName,
    pronoun,
    gender,
    birthday,
    address,
    avatar,
    company,
    jobTitle,
    hashtags,
    notes,
    email,
    contact
  });

  client = await context.functions.execute("utils_getClient", clientId);
  return {
    'success': true,
    'message': "client edited",
    'data': client
  };
};

//exports(new BSON.ObjectId('62d5e0748bfb1bcddfa79812'))  