const createError = require('http-errors');

const utility = rootRequire('helper/utility');
let app = rootRequire('server/server');

module.exports = Client => {
  const vars = app.vars;

  /**
	 * this remote method function will unsuspend a client
   * based on the provided mobile number.
	 */
  Client.unsuspendClient = async mobileNumber => {
    let authentication = Client.app.models.authentication;
    // fetch list of all authentication models by the provided mobileNumber.
    let model = await authentication.findOne({
      where: {
        mobileNumber: mobileNumber.toString()
      }
    });
    if (!model) { throw createError(404); }
    // ready-status model data will be like bellow:
    let data = {
      tryCount: vars.const.tryCount,
      date: utility.getUnixTimeStamp(),
      status: vars.config.verificationStatus.ready
    };
    // update authentication model to make it ready again.
    await model.updateAttributes(data);
    return { status: vars.config.verificationStatus.ready };
  };

  Client.unsuspendClient = utility.wrapper(Client.unsuspendClient);

  /**
  * remote method signiture for unsuspending a client
  * based on the provided mobile number.
  */
  Client.remoteMethod('unsuspendClient', {
    description:
      'unsuspend a client from accessing to endpoints with its mobile number',
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
      path: '/unsuspendClient/:mobileNumber',
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
