let app = rootRequire('server/server');

module.exports = async Authentication => {

  Authentication.validatesInclusionOf('status', {
    in: Object.values(app.vars.config.verificationStatus),
  });

  rootRequire('common/authentication/checkPendingStatus')(
    Authentication);
  rootRequire('common/authentication/checkSuspndedStatus')(
    Authentication);
  rootRequire('common/authentication/checkVerifiedStatus')(
    Authentication);
  rootRequire('common/authentication/enterPassword')(
    Authentication);
  rootRequire('common/authentication/requestForPassword')(
    Authentication);
  rootRequire('common/authentication/sendSMS')(
    Authentication);
  
};
