exports = async function(collectionName) {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("poucouValley").collection(collectionName);
  const query = { };
  await collection.deleteMany(query)
    .then(result => {
      const { deletedCount } = result;
      if (deletedCount) {
        console.log(`Successfully deleted ${deletedCount} documents`)
      }
    })
    .catch(err => console.error(`Failed to delete: ${err}`))
};