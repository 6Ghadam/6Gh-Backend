const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

  // Load the variables from the application server
	const vars = app.vars;
  
  /**
	 * @function updateClient Update a client to a higher level
   * @param {String} clientId String of user's identifier
	 * @param {String} mobileNumber String of user's mobileNumber
   * @returns {Object} Returns the updated client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
	Client.updateClient = async (clientId, mobileNumber) => {
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update default profile creation date in client's profile
    await clientModel.profile.update({
      defaultCreateDate: utility.getUnixTimeStamp()
    });
    // Prepare the data for the updating the client model
    let data = {
      type: vars.config.clientType.default,
      username: mobileNumber.toString(),
      email: mobileNumber.toString() + vars.const.domainName,
      password: mobileNumber.toString()
    };
    // Update the client model based on the provided data
    clientModel = await clientModel.updateAttributes(data);
    return clientModel;
	};

  // Wrapp the function inside the Try/Catch
  Client.updateClient = 
    utility.wrapper(Client.updateClient);

	/**
	 * remote method signiture for update a client model
   * with provided mobileNumber
	 */
  Client.remoteMethod('updateClient', {
    description:
      'Update a particular client with provided data',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'mobileNumber',
      type: 'string',
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/:clientId/updateClient',
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
