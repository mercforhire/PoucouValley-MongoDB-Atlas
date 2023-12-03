exports = async function(apiKey, { planId }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  // check if plan exist
  const plan = await context.functions.execute("utils_getPlan", planId);
  if (!plan) {
    return { 'success': false, 'message': 'PLAN_DOES_NOT_EXIST', 'data': planId };
  }
  
  const cluster = context.services.get("mongodb-atlas");
  const plansCollection = cluster.db("poucouValley").collection("plans");
  const pipeline1 = [
    { "$match":
      { 'merchant': userId }
    },
    { "$sample": 
      { 
        size: 20
      }
    }
  ];
		
	var plans = [];
	await plansCollection.aggregate(pipeline1)
    .toArray()
    .then(result => {
      if(result) {
        console.log(`Successfully found plans: ${result}.`);
        plans = result
      } else {
        console.log("No plans matches the provided query.");
      }
    })
    .catch(err => console.error(`Failed to query: ${err}`));
  
  plans = plans.filter(function(plan) {
      return plan._id.toString() != planId.toString()
  });
    
  return { 'success': true, 'message': "RELATED PLANS FETCHED", 'data': plans };
};

//exports('35d4400a0722290fd669bbd8b3dae042bae43339193cfe7d6816f9a448664fcfdcb90a1e1e1edfb9210a7e926d81afead1c95bdf9eae6079a6d9e64a574be555')