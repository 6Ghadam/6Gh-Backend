module.exports = async Authentication => {

  rootRequire('common/authentication/checkPendingStatus')(Authentication);
  rootRequire('common/authentication/checkTemporarySuspndStatus')(Authentication);
  rootRequire('common/authentication/checkVerifiedStatus')(Authentication);

};
