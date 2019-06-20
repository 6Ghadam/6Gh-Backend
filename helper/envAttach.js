const clientStatus = rootRequire('config/client.status.js');
const verificationStatus = rootRequire('config/verifiaction.status.js');

module.exports = server => {
  server.vars = {
    config: {
      clientStatus,
      verificationStatus
    },
    const: {
      authenticationTryCount: 5
    }
  };
};
