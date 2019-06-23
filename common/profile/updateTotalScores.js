const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Profile => {

  /**
	 * @function updateTotalScores Update amount of clients total scores (add/sub)
   * @param {String} clientId String of user's identifier
   * @param {Number} amount Number of total scores amount to update (positive/negative)
   * @returns {Object} Returns the profile of client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Profile.updateTotalScores = async (clientId, amount) => {
    // Load Client model from app server
    let Client = app.models.client;
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update client's coin by the provided amount and return the model
    let updatedModel = await clientModel.profile.update({
      totalScores: 
        Number(clientModel.accountModel.totalScores) + Number(amount),
    });
    return updatedModel;
  };

  // Wrapp the function inside the Try/Catch
  Profile.updateTotalScores = 
    utility.wrapper(Profile.updateTotalScores);

  /**
  * remote method signiture for Updating client's total scores
  * of provided clientId by provided amount
  */
  Profile.remoteMethod('updateTotalScores', {
    description:
      'Update client total scores of provided clientId by provided amount',
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
      path: '/:clientId/updateTotalScores',
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
