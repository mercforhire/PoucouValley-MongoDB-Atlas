exports = async function(userId, deviceToken, { title, body }) {
  const twilio = require('twilio');
  const twiloSID = context.values.get("twiloSID");
  const twilioServiceSID = context.values.get("twilioServiceSID");
  const twiloAuthToken = context.values.get("twiloAuthToken");
  const client = new twilio(twiloSID, twiloAuthToken);
  
  let promise = new Promise((resolve, reject) => {
    client.notify.v1.services(twilioServiceSID)
    .notifications
    .create({
      apn: {
        aps: {
          alert: {
            title: title,
            body: body
          },
          badge: 1,
          sound: 'default'
        }
      }, identity: [`${userId}-${deviceToken}`]})
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
//exports('62f2006037e95b37a3969e2b', 'e3badd2d1018153bd6963cee5fee0a0b7ac7d845a4a6ba99aed28940da86630b', { title: 'test', body: 'test test' })