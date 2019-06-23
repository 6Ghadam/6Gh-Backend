const utility = rootRequire('helper/utility');

module.exports = Client => {

  /**
	 * @function fetchClient Fetch a client based on the mobileNumber
	 * @param {String} mobileNumber string of user's mobileNumber
   * @returns {Object} Returns the client model in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
	Client.fetchClient = async mobileNumber => {
    // Fetch list of clients based on the provided mobileNumber
    let clientList = await Client.fetchModelsWithNullOption({
      where: {
        username: mobileNumber.toString()
      }
    });
    // return null if the client list was empty
    if (clientList.length === 0) {
      return null;
    }
    // return successful object to caller.
    return clientList[0];
	};

  // Wrapp the function inside the Try/Catch
  Client.fetchClient = 
    utility.wrapper(Client.fetchClient);

	/**
	 * remote method signiture for fetching a client
   * based on the provided user's mobile number.
	 */
  Client.remoteMethod('fetchClient', {
    description:
      'Fetch a client based on the users mobile number',
    accepts: [{
      arg: 'mobileNumber',
      type: 'String',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/fetchClient/:mobileNumber',
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
