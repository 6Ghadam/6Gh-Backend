const createError = require('http-errors');

const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

	const vars = app.vars;
  
  /**
	 * @func	 Function - update a client
   * @param  {String} clientId - {clientId string}
	 * @param  {Object} data - {object}
	 */
	Client.updateClient = async (clientId, data) => {
		// fetch a client based on the provided client identifier.
		let fetchedClient = await Client.findById(clientId);
		// send 404 Http status code if there was no client model.
		if (!fetchedClient) { throw createError(404); }
		// attach default status to input data to say it is not completed yet.
		data.status = vars.config.clientStatus.default;
		data.realm = 'User';
		// update client by the provided data and return successful object to caller.
		let updatedClient = await fetchedClient.updateAttributes(data);
		if (!updatedClient) { throw createError(404); }
		return updatedClient;
	};

	Client.updateClient = utility.wrapper(Client.updateClient);

	/**
	 * remote method signiture for update a client model
   * with provided data
	 */
  Client.remoteMethod('updateClient', {
    description:
      'update a particular client with provided data',
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
      path: '/updateClient/:clientId',
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
