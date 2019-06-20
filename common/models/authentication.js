module.exports = async Authentication => {

  rootRequire('common/authentication/checkPendingStatus')(
    Authentication);
  rootRequire('common/authentication/checkTemporarySuspndedStatus')(
    Authentication);
  rootRequire('common/authentication/checkVerifiedStatus')(
    Authentication);
  rootRequire('common/authentication/enterPassword')(
      Authentication);
  
};
