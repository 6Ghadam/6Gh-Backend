const createError = require('http-errors');

const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Client => {
  
  const vars = app.vars;

  /**
	 * this remote method function will suspend a client
   * based on the provided mobile number.
	 */
  Client.suspendClient = async mobileNumber => {
    let {
      authentication,
      AccessToken
    } = Client.app.models;
    // fetch list of all authentication models by the provided mobileNumber.
    let model = await authentication.findOne({
      where: {
        mobileNumber: mobileNumber.toString()
      }
    });
    if (!model) { throw createError(404); }
    // update client authentication status to permanent suspend.
    await model.updateAttribute({
      status: vars.config.verificationStatus.suspendedPermanent
    });
    // fetch a corresponding client based on the provided mobile number.
    let fetchedClient = await Client.fetchedClient(mobileNumber);
    if (!fetchedClient) { throw createError(404); }
    // remove all related access token of that particular client.
    await AccessToken.destroyAll({
      where: {
          ClientId: fetchedClient.id.toString()
        }
      }
    );
    return { status: vars.config.verificationStatus.suspendedPermanent };
  };

  Client.suspendClient = utility.wrapper(Client.suspendClient);

	/**
	 * remote method signiture for suspending a client
   * based on the provided mobile number.
	 */
  Client.remoteMethod('suspendClient', {
    description:
      'suspend a client from accessing to endpoints with its mobile number',
    accepts: [
      {
        arg: 'mobileNumber',
        type: 'string',
        required: true,
        http: {
          source: 'path'
        }
      }
    ],
    http: {
      path: '/suspendClient/:mobileNumber',
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
