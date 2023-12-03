exports = async function(sid) {
  const twilio = require('twilio');
  const twiloSID = context.values.get("twiloSID");
  const twilioServiceSID = context.values.get("twilioServiceSID");
  const twiloAuthToken = context.values.get("twiloAuthToken");
  const client = new twilio(twiloSID, twiloAuthToken);
  
  let promise = new Promise((resolve, reject) => {
    client.notify.v1.services(twilioServiceSID)
    .bindings(sid)
    .fetch()
    .then(result => {
      resolve(result);
    })
    .catch(err => { 
      reject(err);
    });
  });
  
  var result;
  await promise
    .then(res => {
      result = res;
      console.log(JSON.stringify(res));
    })
    .catch(err => {
      console.error(`twilio error: ${err}`);
    });
  return result;
};