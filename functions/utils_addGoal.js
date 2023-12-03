exports = async function(goal, reward){
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection("goals");
			
  const newItem = { 
    "goal": goal, 
    "reward": reward
  };
			
  await collection.insertOne(newItem)
    .then(result => {
      console.log(`Successfully inserted .`)
    })
    .catch(err => console.error(`Failed to insert : ${err}`))
    
  return { 'success': true };
};