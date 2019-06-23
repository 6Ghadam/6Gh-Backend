const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

  // Load the variables from the application server
	const vars = app.vars;

  /**
	 * @function upgradeClient Update a client to a higher level
   * @param {String} clientId String of user's identifier
	 * @param {Object} data data for upgrading user's profile
   * @returns {Object} Returns the updated client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
	Client.upgradeClient = async (clientId, data) => {
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update completed profile creation date in client's profile
    await clientModel.profile.update({
      completedCreateDate: utility.getUnixTimeStamp()
    });
    // Prepare the data for the updating the client model
    data.type = vars.config.clientType.completed;
    // update the client model based on the provided data
    clientModel = await clientModel.updateAttributes(data);
    return clientModel;
	};

  // Wrapp the function inside the Try/Catch
  Client.upgradeClient = 
    utility.wrapper(Client.upgradeClient);

	/**
	 * remote method signiture for upgrade a client model
   * with provided data
	 */
  Client.remoteMethod('upgradeClient', {
    description: 
      'Upgrate a particular client with provided data',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'data',
      type: 'object',
      http: {
        source: 'body'
      }
    }],
    http: {
      path: '/:clientId/upgradeClient',
      verb: 'PUT',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};
