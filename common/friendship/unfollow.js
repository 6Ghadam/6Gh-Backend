const utility = rootRequire('helper/utility');

const createError = require('http-errors');

module.exports = Friendship => {

  /**
	 * @function unfollow Unfollow a client with followingId by followerId client
   * @param {String} followerId String of source user's identifier
	 * @param {String} followingId String of destination user's identifier
   * @returns {Object} Returns the friendship model in case of successful operation
   * @throws {Error} Throws error if anything happened
	 */
  Friendship.unfollow = async (followerId, followingId) => {
    // Load client model from friendship model
    let Client = Friendship.app.models.Client;
    // Check if both clients exist with provided followerId and followingId
    await Client.fetchModel(followerId.toString());
    await Client.fetchModel(followingId.toString());
    // Search for one friendship model between followerId and followingId
    let friendship = await Friendship.findOne({
      where: {
        and: [
          { followerId: followerId.toString() },
          { followingId: followingId.toString() },
        ]
      }
    });
    // Throw error if there was not any friendship model between followerId and followingId
    // Meaning that client with followerId has not followed a client with followingId yet
    if (!friendship) {
      throw createError(400, 
        'Follower already has not followed this Following');
    }
    // Remove the friendship model between followerId and followingId with friendshipId
    await Friendship.destroyById(friendship.id.toString());
    return { status: 200 };
  };

  // Wrapp the function inside the Try/Catch
  Friendship.unfollow = 
    utility.wrapper(Friendship.unfollow);

	/**
	 * remote method signiture for unfollow a client with provided followingId
   * from a client with provided followerId
	 */
  Friendship.remoteMethod('unfollow', {
    description:
      'Unfollow a client with followingId by a client with followerId',
    accepts: [{
      arg: 'followerId',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'followingId',
      type: 'string',
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/:followerId/unfollow/:followingId',
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
