exports = async function() {
  const axios = require('axios').default;
  
  // Make a request for a user with a given ID
  var result;
  await axios.get('https://api.unsplash.com/photos/', {
      params: {
        "client_id": "S7r_wj5LDB-aPbhupkBM5DEfdGQXcfViXQCCSXcDUCQ", 
        "per_page": 25, 
        "order_by": "latest", 
        "page": 1
      }
    })
    .then(function (response) {
      // handle success
      result = response;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
      console.log("done");
    });
    
    return result;
};