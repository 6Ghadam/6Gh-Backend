const utility = rootRequire('helper/utility');

const createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = Client => {
  
  // Load the variables from the application server
  const vars = app.vars;

  /**
	 * @function suspendClient Suspend a client either temporary or permanently
   * @param {String} clientId String of user's identifier
	 * @param {Boolean} isPermanently Flag of suspension level
   * @returns {Object} Returns the suspended client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Client.suspendClient = async (clientId, isPermanently) => {
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Suspension will work only for non-guest clients
    if (clientModel.type === vars.config.clientType.guest) {
      throw createError(403);
    }
    // Find the suspension status based on the isPermanently flag
    let suspensionStatus = vars.config.suspensionStatus.permanentSuspended;
    if (!isPermanently) {
      suspensionStatus = vars.config.suspensionStatus.temporarySuspended;
    }
    // update client status to permanent suspend
    clientModel = await clientModel.updateAttributes({
      isSuspended: suspensionStatus
    });
    // Load AccessToken model
    let AccessToken = Client.app.models.AccessToken;
    // Remove all related access token of that particular client.
    await AccessToken.destroyAll({
        userId: clientModel.id.toString()
      }
    );
    return clientModel;
  };

  // Wrapp the function inside the Try/Catch
  Client.suspendClient = 
    utility.wrapper(Client.suspendClient);

	/**
	 * remote method signiture for permanently suspending a client
   * based on the provided clientId and isPermanently flag.
	 */
  Client.remoteMethod('suspendClient', {
    description:
      'Suspend a client from accessing \
      to endpoints with its clientId',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    },
    {
      arg: 'isPermanently',
      type: 'boolean',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/:clientId/suspendClient',
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
