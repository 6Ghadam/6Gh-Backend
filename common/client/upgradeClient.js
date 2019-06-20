const createError = require('http-errors');

const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

	const vars = app.vars;

  /**
	 * @func	 Function - update a client
	 * @param  {Object} clientId - {client string identifier to update}
	 * @param  {Object} data - {not set yet!}
	 */
	Client.upgradeClient = async (clientId, data) => {
		// fetch a client based on the provided client identifier.
		let fetchedClient = await Client.findById(clientId);
		// send 404 Http status code if there was no client model.
		if (!fetchedClient) { throw createError(404); }
		// attach completed status to input data to say it is completed not.
		data.status = vars.config.clientStatus.completed;
		// update fetched client by the provided data and return successful object to caller.
		let updatedClient = await fetchedClient.updateAttributes(data);
		if (!updatedClient) { throw createError(404); }
		return updatedClient;
	};

	Client.upgradeClient = utility.wrapper(Client.upgradeClient);

	/**
	 * remote method signiture for upgrade a client model
   * with provided data
	 */
  Client.remoteMethod('upgradeClient', {
    description:
      'upgrate a particular client with provided data',
    accepts: [
      {
        arg: 'clientId',
        type: 'string',
        required: true,
        http: {
          source: 'path'
        }
			},
      {
        arg: 'data',
        type: 'object',
        http: {
          source: 'body'
        }
      }
    ],
    http: {
      path: '/upgradeClient/:clientId',
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
