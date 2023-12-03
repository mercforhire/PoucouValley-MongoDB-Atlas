exports = async function(email) {
  email = email.toLowerCase()
  
  const cluster = context.services.get("mongodb-atlas");
  const verifyCodes = cluster.db("poucouValley").collection("verifyCodes");
	const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  const query = { 'email': email };
  const newItem = { 
    'email': email,
    'code': verifyCode,
    'createdDate': new Date()
  };
  const options = { upsert: true };
			
  await verifyCodes.updateOne(query, newItem, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated the item.`)
      }
    })
    .catch(err => console.error(`Failed to update the item: ${err}`))
  
  console.log(`Sending code to ${verifyCode} to ${email}`);
	const msg = {
		to: email,
		from: "Poucou Valley<contact@finixlab-inc.com>",
		subject: "Poucou Valley email verification code",
		html: `<p>Your Poucou Valley email verification code is: ${verifyCode}</p>
				   <p style="margin: 0;">&reg; Powered by Bytera Inc</p>`,
	};
  
  const apiKey = context.values.get("sgMailApiKey");
	const sgMail = require("@sendgrid/mail");
	sgMail.setApiKey(apiKey);

  var success = false;
  var message = "";
  await sgMail
		.send(msg)
		.then((res) => {
			message = `${verifyCode} sent to ${email}`;
			success = true;
		})
		.catch((error) => {
			message = "Fail to send verifyCode: " + verifyCode;
			success = false
		});
		
	console.log(message);
	return { 'success': success, 'message': message };
};

//exports('Tess.Oberbrunner@hotmail.com')