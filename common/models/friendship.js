module.exports = async Friendship => {

  rootRequire('common/friendship/follow')(
    Friendship);
  rootRequire('common/friendship/unfollow')(
    Friendship);

};
