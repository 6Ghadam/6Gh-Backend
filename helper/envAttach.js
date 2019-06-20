const clientStatus = rootRequire('config/client.status.js');
const verificationStatus = rootRequire('config/verifiaction.status.js');

const authenticationTryCount = 5;
const authenticationAttemptsThresholdTime = 60 * 1000;
const authenticationVerifiedTime = 3 * 24 * 60 * 60 * 1000;

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      verificationStatus
    },
    const: {
      authenticationTryCount,
      authenticationAttemptsThresholdTime,
      authenticationVerifiedTime
    }
  };
};
