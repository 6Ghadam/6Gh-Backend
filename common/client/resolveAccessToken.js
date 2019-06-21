const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

  /**
	 * @function resolveAccessToken Resolve an access token to check if it is still valid or not
	 * @param {String} accessToken String of user's access_token
   * @returns {Object} Returns the resolved object in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Client.resolveAccessToken = accessToken =>
    // Create a promise to handle the resolve and reject operation
		new Promise((resolve, reject) => {
      // Load the AccessToken model
      let AccessToken = app.models.AccessToken;
      // Resolve the provided accessToken
			AccessToken.resolve(accessToken, (err, res) => {
				if (err) {
					return reject(err);
				}
				resolve(res);
			});
		}
	);

  // Wrapp the function inside the Try/Catch
  Client.resolveAccessToken = 
    utility.wrapper(Client.resolveAccessToken);

	/**
	 * remote method signiture for resolving an access token
   * to check if it's still valid or not
	 */
  Client.remoteMethod('resolveAccessToken', {
    description:
      'Resolve an access token to check if its still valid or not',
    accepts: [{
      arg: 'accessToken',
      type: 'String',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/resolveAccessToken',
      verb: 'GET',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};
