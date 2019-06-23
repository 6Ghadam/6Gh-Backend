const utility = rootRequire('helper/utility');

let app = rootRequire('server/server');

module.exports = Profile => {

  /**
	 * @function updateBill Update amount of clients bill (add/sub)
   * @param {String} clientId String of user's identifier
   * @param {Number} amount Number of bills amount to update (positive/negative)
   * @returns {Object} Returns the profile of client in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Profile.updateBill = async (clientId, amount) => {
    // Load Client model from app server
    let Client = app.models.client;
    // Fetch the client model based on the provided clientId
    let clientModel = await Client.fetchModel(clientId.toString());
    // Update client's bill by the provided amount and return the model
    let updatedModel = await clientModel.profile.update({
      bills: Number(clientModel.accountModel.bills) + Number(amount),
    });
    return updatedModel;
  };

  // Wrapp the function inside the Try/Catch
  Profile.updateBill = 
    utility.wrapper(Profile.updateBill);

  /**
  * remote method signiture for Updating client's bill
  * of provided clientId by provided amount
  */
  Profile.remoteMethod('updateBill', {
    description:
      'Update client bill of provided clientId by provided amount',
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
      path: '/:clientId/updateBill',
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
