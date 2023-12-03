exports = async function(apiKey, { keyword, category }) {
  // check if apiKey valid
  var userId = await context.functions.execute("utils_verifyAPIKey", apiKey);
  if (!userId) {
    return { 'success': false, 'message': 'APIKEY_INVALID', 'data': apiKey };
  }
  
  const results = await context.functions.execute("utils_searchShops", keyword, category);
  return { 'success': true, 'message': "SEARCH RESULTS RETURNED", 'data': results };
};

//exports('2a3463b80bddac713766ce3ee1145a1f5ffffbfe47dca22bb0046351bd114555ea9b36ad8fc8c02af7dec26ff747ee2780e10c14dfed75883a71f64488cd694d', { keyword: 'shoes' })