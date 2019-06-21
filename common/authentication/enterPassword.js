const utility = rootRequire('helper/utility');

let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  // Load the variables from the application server
  const vars = app.vars;

  /**
	 * @function enterPassword Enter the a password to authenticate the mobileNumber
	 * @param {String} mobileNumber string of user's mobileNumber
   * @param {String} password string of user's password
   * @param {String} clientAppId string of user's client app id
   * @returns {Object} Returns login info in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Authentication.enterPassword = 
    async (mobileNumber, password, clientAppId) => {
    // Search for clients with provided mobileNumber
    let authList = await Authentication.fetchModels({
      where: {
        mobileNumber: mobileNumber.toString()
      }
    });
    // Load authentication model from auth list
    let model = authList[0];
    // Throw error if authentication for this mobile number is suspended
    if (model.status === vars.config.verificationStatus.suspended) {
      throw createError(423);
    }
    // Throw error if authentication for this mobile number is not set and is ready
    if (model.status === vars.config.verificationStatus.ready) {
      throw createError(404);
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
          username: clientModel.username.toString(),
          password: clientModel.username.toString()
        });
        return loginResult;
      }
    }
    // Reduce the tryCount by one to collect in authentication model
    let newTryCount = Number(model.tryCount) - 1;
    // Get the current timestamp
    let time = utility.getUnixTimeStamp();
    // Check if tryCount is equal or lower than zero
    if (newTryCount <= 0) {
      // Prepare data for updating the authentiation model
      let data = {
        status: vars.config.suspensionStatus.suspended,
        date: time
      };
      // Update the authentication model to suspend the authentication
      // for this mobile number and throw error
      await model.updateAttributes(data);
      throw createError(423);
    }
    // Check if current time has put the authentication model
    // in ready state again or not
    let expireDate = Number(model.date) + Number(model.ttl);
    if (time > expireDate) {
      // Prepare data for updating the authentiation model
      let data = {
        tryCount: vars.const.authenticationTryCount,
        date: time,
        status: vars.config.verificationStatus.ready
      };
      // Update the authentication model to ready the authentication
      // for this mobile number and throw error
      await model.updateAttributes(data);
      throw createError(404);
    }
    // Check if provided password for this mobile number is correct or not
    if (password.toString() !== model.password.toString()) {
      // Update the authentication model with decreased tryCount
      // and throw error
      await model.updateAttribute('tryCount', newTryCount);
      throw createError(401);
    }
    else {
      // Create client model if the client model doesn't exist for this mobile number
      if (!clientModel) {
        // Search for guest client related to this client app id
        let guestClientList = await Client.fetchModels({
          where: {
            clientAppId: clientAppId.toString()
          }
        });
        // Load the guest client model from guest client list first element
        let guestClientModel = guestClientList[0];
        // Update the guest client to default client
        await Client.updateClient(guestClientModel.id.toString(), 
          mobileNumber.toString());
      }
      // Prepare data for updating the authentiation model
      let data = {
        status: vars.config.verificationStatus.verified,
        date: time
      };
      // Update the authentication model to verified the authentication
      await model.updateAttributes(data);
      // Login the user via the provided mobile umber
      let loginResult = await Client.login({
        username: mobileNumber.toString(),
        password: mobileNumber.toString()
      });
      return loginResult;
    }
  };

  // Wrapp the function inside the Try/Catch
  Authentication.enterPassword = 
    utility.wrapper(Authentication.enterPassword);

  /**
	 * remote method signiture for entering the password
   * to authenticate the provided mobile number
	 */
  Authentication.remoteMethod('enterPassword', {
    description: 'Enter the mobile number and provided\
                  password to check authentication',
    accepts: [{
      arg: 'mobileNumber',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    },
    {
      arg: 'password',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'clientAppId',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/:mobileNumber/enterPassword/:password',
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