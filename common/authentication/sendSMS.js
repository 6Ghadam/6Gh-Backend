const utility = rootRequire('helper/utility');

let request = require('request');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  // Load the variables from the application server
	const vars = app.vars;

  // Prepare the api url for kavenegar api
  let apiURL = vars.const.smsAPIBaseURL.replace('@', vars.const.smsAPIToken);

  // the function to wrap the request module in a promise form
  function getRequest(url) {
    // Create a promise to handle the resolve and reject operation
		return new Promise((resolve, reject) => {
      request.get(url).on('response', data =>
        resolve(data)
      ).on('error', err =>
        reject(err)
      );
		});
  }

  /**
	 * @function sendSMS Send a random number token to the provided mobile number
	 * @param {String} mobileNumber string of user's mobileNumber
   * @param {String} randNumber string of random number token
   * @returns {Object} Returns result info in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Authentication.sendSMS = async (mobileNumber, randNumber) => {
    // Prepare the data for kavengar API Call
		let data = {
			receptor: mobileNumber.toString(),
			token: randNumber.toString(),
			template: vars.const.authenticationTemplate
    };
    if (process.env.NODE_ENV !== vars.config.nodeEnvironment.production) {
      return data;
    }
    // Prepare the request query string
    let url = apiURL + '?' + utility.generateQueryString(data);
    // Send the HTTP GET request to the kavenegar api
    let result = await getRequest(url);
    return result;
  };

  // Wrapp the function inside the Try/Catch
  Authentication.sendSMS = 
    utility.wrapper(Authentication.sendSMS);

	/**
	 * remote method signiture for sending a randnumber
   * token to the provided mobileNumber.
	 */
  Authentication.remoteMethod('sendSMS', {
    description: 'Send the random number token to\
                  to the provided mobileNumber',
    accepts: [{
      arg: 'mobileNumber',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'randNumber',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:mobileNumber/sendSMS/:randNumber',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};