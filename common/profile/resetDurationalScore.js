const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Profile => {

  // Load the variables from the application server
	const vars = app.vars;

  /**
	 * @function resetDurationalScore Reset of clients last durational score to zero
   * @param {String} clientId String of user's identifier
   * @returns {Object} Returns the profile of client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Profile.resetDurationalScore = async clientId => {
    // Load Client model from app server
    let Client = app.models.client;
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update client's last durational score to zero and return the model
    let updatedModel = await clientModel.profile.update({
      lastDurationalScore: vars.const.zeroNumber
    });
    return updatedModel;
  };

  // Wrapp the function inside the Try/Catch
  Profile.resetDurationalScore = 
    utility.wrapper(Profile.resetDurationalScore);

  /**
  * remote method signiture for Reset client's last durational score
  * of provided clientId to zero
  */
  Profile.remoteMethod('resetDurationalScore', {
    description:
      'Reset client last durational score of provided clientId to zero',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:clientId/resetDurationalScore',
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
