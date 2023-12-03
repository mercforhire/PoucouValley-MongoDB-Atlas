exports = async function(cardholderId, merchantId, amount) {
  const cardholderUser = await context.functions.execute("utils_getUserById", cardholderId);
  if (!cardholderUser) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': cardholderId };
  }
  
  const merchantUser = await context.functions.execute("utils_getUserById", merchantId);
  if (!merchantUser) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  const cardholder = await context.functions.execute("utils_getCardholderById", cardholderId);
  if (!cardholder) {
    return { 'success': false, 'message': 'CARDHOLDER_DOES_NOT_EXIST', 'data': cardholderId };
  }
  
  const merchant = await context.functions.execute("utils_getMerchantById", merchantId);
  if (!merchant) {
    return { 'success': false, 'message': 'MERCHANT_DOES_NOT_EXIST', 'data': merchantId };
  }
  
  const title = `Poucou card scanned!`;
  const body = `${cardholder.firstName}'s card has just been scanned by ${merchant.name}! Both parties have received ${amount} coin(s).`;
  
  var twilioResponses = [];
  if ((typeof(cardholderUser.settings) !== 'undefined' && cardholderUser.settings.notification != 'OFF') && cardholderUser.deviceTokens != null) {
    for (const deviceToken of cardholderUser.deviceTokens) {
      const twilioResponse = await context.functions.execute("twilio_send_msg_to_identity", cardholderUser._id, deviceToken.deviceToken, { title, body });
      twilioResponses.push(twilioResponse);
    }
  }
  if ((typeof(merchantUser.settings) !== 'undefined' && merchantUser.settings.notification != 'OFF') && merchantUser.deviceTokens != null) {
    for (const deviceToken of merchantUser.deviceTokens) {
      const twilioResponse = await context.functions.execute("twilio_send_msg_to_identity", merchantUser._id, deviceToken.deviceToken, { title, body });
      twilioResponses.push(twilioResponse);
    }
  }
  
  return twilioResponses;
};

//exports(new BSON.ObjectId('62f4280437e95b37a3f8e6de'), new BSON.ObjectId('62f2006037e95b37a3969e2b'), 1);
