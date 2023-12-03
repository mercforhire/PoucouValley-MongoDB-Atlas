exports = async function() {
  const axios = require('axios').default;
  
  // Make a request for a user with a given ID
  var results = [];
  await axios.get('https://pixabay.com/api/', {
      timeout: 3000,
      params: {
        'key': '25560431-f85e9e607fe6f311b6d329bd0',
        'image_type': 'photo',
        'page': 2,
        'per_page': 100
      }
    })
    .then(function (response) {
      // handle success
      for (const hit of response.data.hits) {
        results.push(hit.previewURL);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    
    return results;
};