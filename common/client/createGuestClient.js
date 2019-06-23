const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {
  
  // Load the variables from the application server
	const vars = app.vars;

  /**
	 * @function createGuestClient Create a guest client and return login info
   * @param {String} clientAppId string of user's client app id
   * @returns {Object} Returns the login info in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
	Client.createGuestClient = async clientAppId => {
    let credentialFactor;
    // Search for clients with provided clientAppId
    let clientList = await Client.fetchModelsWithNullOption({
      where: {
        clientAppId: clientAppId.toString()
      }
    });
    // Create user if there was not any client model related to this clientAppId
    if (clientList.length === 0) {
      credentialFactor = clientAppId.toString();
      // Prepare the data for creating the profile model
      let profileData = {
        coins: vars.config.inputType.zeroNumber,
        bills: vars.config.inputType.zeroNumber,
        guestCreateDate: utility.getUnixTimeStamp(),
        defaultCreateDate: vars.config.inputType.zeroNumber,
        completedCreateDate: vars.config.inputType.zeroNumber,
        totalScores: vars.config.inputType.zeroNumber,
        lastDurationalScore: vars.config.inputType.zeroNumber,
        lastScoreLevel: vars.config.inputType.zeroNumber,
        lastLevelUpDate: vars.config.inputType.zeroNumber
      };
      // Attach default type to input data to determine it is not completed yet.
      let data = {
        clientAppId: clientAppId.toString(),
        type: vars.config.clientType.guest,
        realm: vars.const.userRealm,
        username: clientAppId.toString(),
        email: clientAppId.toString() + vars.const.domainName,
        password: clientAppId.toString(),
        isSuspended: vars.config.suspensionStatus.false,
        profileModel: profileData
      };
      // Create client by the provided data 
      await Client.create(data);
    }
    else {
      // Load the client model from client list
      let clientModel = clientList[0];
      // Check based on client status to determine the credential factor
      if (clientModel.type === vars.config.clientType.guest) {
        credentialFactor = clientList[0].clientAppId.toString();
      }
      else if (clientModel.type === vars.config.clientType.default ||
        clientModel.type === vars.config.clientType.completed) {
        credentialFactor = clientList[0].username.toString();
      }
    }
    // Login user and return successful object to caller.
    let loginResult = await Client.login({
      realm: vars.const.userRealm,
      username: credentialFactor.toString(),
      password: credentialFactor.toString()
    });
    return loginResult;
	};

  // Wrapp the function inside the Try/Catch
  Client.createGuestClient = 
    utility.wrapper(Client.createGuestClient);

	/**
	 * remote method signiture for creating a guest client
   * based on the provided clientAppId of user's request.
	 */
  Client.remoteMethod('createGuestClient', {
    description:
      'Create a guest client based on the users app id',
    accepts: [{
      arg: 'clientAppId',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/createGuestClient',
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
