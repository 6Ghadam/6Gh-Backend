const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {
  
	const vars = app.vars;

  /**
	 * @func	 Function - create a guest client
	 * @param  {Object} ipAddress - {ipAddress string}
	 */
	Client.createGuestClient = async ipAddress => {
		// attach default status to input data to say it is not completed yet.
		let data = {
			ipAddress,
			status: vars.config.clientStatus.guest,
			realm: 'User',
			username: ipAddress,
			email: ipAddress + '@6ghadam.com',
			password: ipAddress
		};
		// create client by the provided data and return successful object to caller.
		let clientModel = await Client.create(data);
		return clientModel;
	};

	Client.createGuestClient = utility.wrapper(Client.createGuestClient);

};
