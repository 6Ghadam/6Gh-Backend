const createError = require('http-errors');

const utility = rootRequire('helper/utility');
let app = rootRequire('server/server');

module.exports = Client => {

  // Load the variables from the application server
  const vars = app.vars;

  /**
	 * @function unsuspendClient Unsuspend a client
   * @param {String} clientId String of user's identifier
   * @returns {Object} Returns the unsuspended client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Client.unsuspendClient = async clientId => {
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Unsuspension will work only for non-guest clients
    if (clientModel.type === vars.config.clientType.guest) {
      throw createError(403);
    }
    // update client status to permanent suspend
    clientModel = await clientModel.updateAttribute({
      isSuspended: vars.config.suspensionStatus.false
    });
    return clientModel;
  };

  // Wrapp the function inside the Try/Catch
  Client.unsuspendClient = 
    utility.wrapper(Client.unsuspendClient);

  /**
  * remote method signiture for unsuspending a client
  * based on the provided clientId.
  */
  Client.remoteMethod('unsuspendClient', {
    description:
      'Unsuspend a client from accessing \
      to endpoints with its clientId',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:clientId/unsuspendClient',
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
