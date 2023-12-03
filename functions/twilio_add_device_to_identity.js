exports = async function(userId, deviceToken) {
  const twilio = require('twilio');
  const twiloSID = context.values.get("twiloSID");
  const twilioServiceSID = context.values.get("twilioServiceSID");
  const twiloAuthToken = context.values.get("twiloAuthToken");
  const client = twilio(twiloSID, twiloAuthToken);
  
  let promise = new Promise((resolve, reject) => {
    client.notify.v1.services(twilioServiceSID).bindings
    .create({
      identity: `${userId}-${deviceToken}`,
      bindingType: 'apn',
      address: deviceToken
    })
    .then(binding => {
      resolve(binding);
    })
    .catch(err => { 
      reject(err);
    });
  });
  
  var sid;
  await promise
    .then(binding => {
      sid = binding.sid;
      console.log('binding:', JSON.stringify(binding));
    })
    .catch(err => {
      console.error(`twilio error: ${err}`);
    });
  return sid;
};
//exports('62f2006037e95b37a3969e2b', 'e3badd2d1018153bd6963cee5fee0a0b7ac7d845a4a6ba99aed28940da86630b');