exports = async function() {
  // pick a random cardholder
  const cardholder = await context.functions.execute("test_getRandomCardholder");
  if (!cardholder) {
    return { 'success': false, 'message': "NO CARDHOLDERS", 'data': null };
  }
  
  // get the user
  const user = await context.functions.execute("utils_getUserByID", cardholder.userId);
  
  // pick a random goal
  const goal = await context.functions.execute("test_getRandomGoal");
  if (!goal) {
    return { 'success': false, 'message': "NO GOALS", 'data': null };
  }
  
  const response = await context.functions.execute("api_addAccomplishment", user.apiKey, { goalId: goal._id });
  return response;
};
