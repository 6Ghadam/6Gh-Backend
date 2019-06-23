const utility = rootRequire('helper/utility');

let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  // Load the variables from the application server
  const vars = app.vars;

  /**
	 * @function requestForPassword Request to send a password to the mobileNumber
	 * @param {String} mobileNumber string of user's mobileNumber
   * @returns {Object} Returns true in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Authentication.requestForPassword = async mobileNumber => {
    // Generate a 6Digit random number and get current timestamp
    let rand = utility.generateRandomNumber(
      vars.const.authenticationLowerBracketPin, 
      vars.const.authenticationUpperBracketPin);
    let time = utility.getUnixTimeStamp();
    // Search for clients with provided mobileNumber
    let authList = await Authentication.fetchModelsWithNullOption({
      where: {
        mobileNumber: mobileNumber.toString()
      }
    });
    // Prepare data entry for authentication model
    let data = {
      mobileNumber: mobileNumber.toString(),
      password: rand.toString(),
      date: time,
      status: vars.config.verificationStatus.pending
    };
    // Create authentication model and then send sms in case of empty authList
    // Otherwise check for authentication model and then update the auth model
    // then send sms
    if (authList.length <= 0) {
      // Create authentication model for this mobile number
      await Authentication.create(data);
      // Send SMS to this mobile number including this rand token
      await Authentication.sendSMS(mobileNumber.toString(), rand.toString());
      // Return the successful status
      return { status: vars.config.verificationStatus.pending };
    } 
    else {
      // Load authentication model from auth list
      let model = authList[0];
      // Throw error if authentication for this mobile number is suspended
      if (model.status === vars.config.verificationStatus.suspended) {
        throw createError(423);
      }
      // Load client model from models
      let Client = app.models.client;
      // fetch client related to this mobileNumber
      let clientModel = await Client.fetchClient(mobileNumber.toString());
      if (clientModel) {
        // Throw error if access for this client is suspended
        if (clientModel.isSuspended !== vars.config.suspensionStatus.false) {
          throw createError(423);
        }
        // Return authentication model if authentication for this mobile number is verified
        // and client is either default or completed profile level type
        if (model.status === vars.config.verificationStatus.verified && 
           (clientModel.type === vars.config.clientType.default ||
            clientModel.type === vars.config.clientType.completed)) {
          // Login user and return successful object to caller.
          let loginResult = await Client.login({
            realm: vars.const.userRealm,
            username: clientModel.username.toString(),
            password: clientModel.username.toString()
          });
          return loginResult;
        }
      }
      // check if 60 secs is passed to generate/send new password.
      if (Number(model.date) + 
          Number(vars.const.authenticationAttemptsThresholdTime) < time) {
        // Update authentication model for thie mobile number
        await model.updateAttributes(data);
        // Send SMS to this mobile number including this rand token
        await Authentication.sendSMS(mobileNumber.toString(), rand.toString());
        // Return the successful status
        return { status: vars.config.verificationStatus.pending };
      }
      else {
        // send 405 Http status code to say this function is not ready to use.
        throw createError(405);
      }
    }
  };

  // Wrapp the function inside the Try/Catch
  Authentication.requestForPassword = 
    utility.wrapper(Authentication.requestForPassword);

	/**
	 * remote method signiture for requesing to generate and
   * and send a password to provided mobile number.
	 */
  Authentication.remoteMethod('requestForPassword', {
    description: 'Enter the mobile number in\
                  order to receive the password code.',
    accepts: [{
      arg: 'mobileNumber',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:mobileNumber/requestForPassword',
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