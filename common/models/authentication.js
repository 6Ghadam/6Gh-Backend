module.exports = async Authentication => {

  rootRequire('common/authentication/checkPendingStatus')(Authentication);
  rootRequire('common/authentication/checkTemporarySuspndStatus')(Authentication);

};
