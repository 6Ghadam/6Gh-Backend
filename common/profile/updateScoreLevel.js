const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Profile => {

  /**
	 * @function updateScoreLevel Update amount of clients score level (add/sub)
   * @param {String} clientId String of user's identifier
   * @param {Number} amount Number of score level amount to update (positive/negative)
   * @returns {Object} Returns the profile of client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Profile.updateScoreLevel = async (clientId, amount) => {
    // Load Client model from app server
    let Client = app.models.client;
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update client's score level by the provided amount at this moment of time
    let updatedModel = await clientModel.profile.update({
      lastScoreLevel: 
        Number(clientModel.accountModel.lastScoreLevel) + Number(amount),
      lastLevelUpDate: utility.getUnixTimeStamp()
    });
    return updatedModel;
  };

  // Wrapp the function inside the Try/Catch
  Profile.updateScoreLevel = 
    utility.wrapper(Profile.updateScoreLevel);

  /**
  * remote method signiture for Updating client's score level
  * of provided clientId by provided amount
  */
  Profile.remoteMethod('updateScoreLevel', {
    description:
      'Update client score level of provided clientId by provided amount',
    accepts: [{
      arg: 'clientId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'amount',
      type: 'number',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/:clientId/updateScoreLevel',
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
