exports = async function(sid) {
  const twilio = require('twilio');
  const twiloSID = context.values.get("twiloSID");
  const twilioServiceSID = context.values.get("twilioServiceSID");
  const twiloAuthToken = context.values.get("twiloAuthToken");
  const client = new twilio(twiloSID, twiloAuthToken);
  
  let promise = new Promise((resolve, reject) => {
    client.notify.v1.services(twilioServiceSID)
    .bindings(sid)
    .remove()
    .then(result => {
      resolve(result);
    })
    .catch(err => { 
      reject(err);
    });
  });
  
  var success = false;
  await promise
    .then(result => {
      console.log(JSON.stringify(result));
      if (result) {
        success = true
      }
    })
    .catch(err => {
      console.error(`twilio error: ${err}`);
    });
  return success;
};
//exports('BSe9c4364f99338382c123ea1607641dba');
