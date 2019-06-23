const utility = rootRequire('helper/utility');

module.exports = Client => {

  /**
	 * @function generateRandomId Generate random client application identifier
   * @returns {Object} Returns the identifier in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
	Client.generateRandomId = async () => {
    // Prepare the variables for further usage inside the do/while block
    let clientList = [];
    let randomNumber;
    // Iterate till the clientList of searched random number was empty
    do {
      // Generate new random number
      randomNumber = utility.generateRandomNumber(11111111, 99999999);
      // Fetch list of clients based on the provided random number
      clientList = await Client.fetchModelsWithNullOption({ 
        where: { 
          username: randomNumber.toString() 
        } 
      });
    } while (clientList.length !== 0);
    // Return the client application identifier filled by new random number
    return { clientAppId: randomNumber.toString() };
	};

  // Wrapp the function inside the Try/Catch
  Client.generateRandomId = 
    utility.wrapper(Client.generateRandomId);

	/**
	 * remote method signiture for generating
   * a new random client application identifier.
	 */
  Client.remoteMethod('generateRandomId', {
    description:
      'Generate new random client application identifier',
    accepts: [],
    http: {
      path: '/generateRandomId',
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
