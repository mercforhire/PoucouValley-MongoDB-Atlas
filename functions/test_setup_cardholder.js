exports = async function(cardholderId, cardNumber) {
  var cardholder = await context.functions.execute("utils_getCardholderById", cardholderId);
  console.log('cardholder: ' + cardholder);
  if (!cardholder) {
    return {
      'success': false,
      'message': 'CARDHOLDER_DOES_NOT_EXIST',
      'data': cardholderId
    };
  }

  const {
    faker
  } = require('@faker-js/faker');

  const firstName = faker.name.firstName();
  console.log(firstName);

  const lastName = faker.name.lastName();
  console.log(lastName);

  const gender = faker.name.gender(true);
  console.log(gender);

  const pronoun = gender == "Male" ? "He" : "She";
  console.log(pronoun);

  const randomDate = faker.date.between('1970-01-01T00:00:00.000Z', '2012-01-01T00:00:00.000Z');
  const month = randomDate.getUTCMonth() + 1; //months from 1-12
  const day = randomDate.getUTCDate();
  const year = randomDate.getUTCFullYear();
  const birthday = {
    day: day,
    month: month,
    year: year
  };
  console.log(JSON.stringify(birthday, null, 2));

  var contact = cardholder.contact;
  contact.website = faker.internet.url();
  contact.facebook = faker.internet.url();
  contact.instagram = faker.internet.url();
  contact.phoneAreaCode = '1';
  contact.phoneNumber = faker.phone.phoneNumber('#########');
  contact.twitter = faker.internet.url();
  console.log(JSON.stringify(contact, null, 2));

  const address = {
    unitNumber: faker.random.numeric(2),
    streetNumber: faker.address.buildingNumber(),
    street: faker.address.streetName(),
    city: faker.address.city(),
    province: faker.address.state(),
    country: faker.address.country(),
    postalCode: faker.address.zipCode()
  };
  console.log(JSON.stringify(address, null, 2));

  const thumbnailUrl = await context.functions.execute('test_randomPhoto');
  const fullUrl = await context.functions.execute('test_randomPhoto');
  const avatar = { thumbnailUrl, fullUrl };
  console.log('avatar:', avatar);

  const interest = await context.functions.execute("test_getRandomBusinessType");
  console.log('interest:', interest);
  
  var card;
  if (cardNumber) {
    card = await context.functions.execute("utils_getCardByNumber", cardNumber);
    if (!card) {
      return {
        'success': false,
        'message': 'CARD_DOES_NOT_EXIST',
        'data': cardNumber
      };
    }
  } else {
    const addRandomCardResult = await context.functions.execute("test_addRandomCard");
    card = addRandomCardResult.data;
    if (!card) {
      return {
        'success': false,
        'message': 'test_addRandomCard fatal error',
        'data': null
      };
    }
  }
  console.log('card number:', card.number);
  
  const user = await context.functions.execute("utils_getUserById", cardholderId);
  if (!user) {
    return {
      'success': false,
      'message': 'USER_DOES_NOT_FOUND',
      'data': cardholderId
    };
  }

  const addCardToCardholderResult = await context.functions.execute("api_addCardToCardholder", user.apiKey, { 'cardNumber': card.number, 'cardPin': card.pin });
  if (!addCardToCardholderResult.success) {
    return addCardToCardholderResult;
  }
  
  const update = {
    "$set": {
      "firstName": firstName,
      "lastName": lastName,
      "pronoun": pronoun,
      "gender": gender,
      "birthday": birthday,
      "contact": contact,
      "address": address,
      "avatar": avatar,
      "interests": [interest]
    }
  };

  const query = {
    "_id": cardholder._id
  };
  const options = {
    "upsert": false
  };

  const cluster = context.services.get("mongodb-atlas");
  const cardholders = cluster.db("poucouValley").collection("cardholders");
  await cardholders.updateOne(query, update, options)
    .then(result => {
      const {
        matchedCount,
        modifiedCount
      } = result;
      if (matchedCount && modifiedCount) {
        console.log(`Successfully updated card`);
      }
    })
    .catch(err => console.error(`Failed to update cardholder: ${err}`));

  cardholder = await context.functions.execute("utils_getCardholderById", cardholderId);
  
  return {
    'success': true,
    'message': "test_setup_cardholder SUCCESS",
    'data': cardholder
  };
};

//exports(new BSON.ObjectId('62dbcf879f467f7f9ece0015'), "M-101778-Z")