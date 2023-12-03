exports = async function(apiKey, { goalIds }){
  // check user exist
  const user = await context.functions.execute("utils_getUserByAPIKey", apiKey);
  console.log('user: ' + user);
   if (!user) {
    return { 'success': false, 'message': 'USER_DOES_NOT_EXIST', 'data': null }
  }
  
  if (!Array.isArray(goalIds)) {
    return { 'success': false, 'message': 'goalIds IS NOT AN ARRAY', 'data': goalIds }
  }
  
  var response;
  for (const goalId of goalIds) {
    response = await context.functions.execute("utils_addAccomplishment", user._id, goalId);
  }
  return response;
};

//exports('5956e99a89b7f40836cb4bd07b0aa8dfe938d2df7a579be136d52e614c08a406e798c8b3e903d047961ac77ab50a02610ba946c61fd73cf76fb8e11b4824cbf4', {'goalId': new BSON.ObjectId('6293069c02e83cefed480a19') })
