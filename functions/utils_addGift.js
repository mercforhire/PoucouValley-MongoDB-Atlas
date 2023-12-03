exports = async function(name, costInCoins, description, description2, photos){
  const cluster = context.services.get("mongodb-atlas");
  const gifts = cluster.db("poucouValley").collection("gifts");
			
  const newGift = { 
    'createdDate': new Date(),
    "name": name, 
    "costInCoins": costInCoins,
    "description": description,
    "description2": description2,
    "photos": photos
  };
			
  await gifts.insertOne(newGift)
    .then(result => {
      console.log(`Successfully inserted gift.`)
    })
    .catch(err => console.error(`Failed to insert gift: ${err}`))
    
  return { 'success': true };
};

// exports(
//  '$10 giftcard', 
//  100,
//  'Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.', 
//  'description2', 
//  [
//     {
//     "thumbnameUrl": 'www.image1.com',
//     "fullUrl": 'www.image1.com'
//     },
//     {
//     "thumbnameUrl": 'www.image2.com',
//     "fullUrl": 'www.image2.com'
//     },
//     {
//     "thumbnameUrl": 'www.image3.com',
//     "fullUrl": 'www.image3.com'
//     }
//   ]
// )