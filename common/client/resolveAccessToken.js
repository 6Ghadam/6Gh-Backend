const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {

  /**
	 * @func	 Function - resolve an access token
	 * @param  {Object} accessToken - {accessToken string}
	 */
  Client.resolveAccessToken = accessToken =>
		new Promise((resolve, reject) => {
			let AccessToken = app.models.AccessToken;
			AccessToken.resolve(accessToken, (err, res) => {
				if (err) {
					return reject(err);
				}
				resolve(res);
			});
		}
	);

	Client.resolveAccessToken = utility.wrapper(Client.resolveAccessToken);

};
