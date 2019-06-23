const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Profile => {

  /**
	 * @function updateDurationalScore Update amount of clients last durational score (add/sub)
   * @param {String} clientId String of user's identifier
   * @param {Number} amount Number of last durational score amount to update (positive/negative)
   * @returns {Object} Returns the profile of client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Profile.updateDurationalScore = async (clientId, amount) => {
    // Load Client model from app server
    let Client = app.models.client;
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update client's last durational score by the provided amount and return the model
    let updatedModel = await clientModel.profile.update({
      lastDurationalScore: 
        Number(clientModel.accountModel.lastDurationalScore) + Number(amount),
    });
    return updatedModel;
  };

  // Wrapp the function inside the Try/Catch
  Profile.updateDurationalScore = 
    utility.wrapper(Profile.updateDurationalScore);

  /**
  * remote method signiture for Updating client's last durational score
  * of provided clientId by provided amount
  */
  Profile.remoteMethod('updateDurationalScore', {
    description:
      'Update client last durational score \
       of provided clientId by provided amount',
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
      path: '/:clientId/updateDurationalScore',
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
