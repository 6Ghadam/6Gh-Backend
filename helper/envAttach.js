const verificationStatus = rootRequire('config/verifiaction.status.js');

module.exports = server => {
  server.vars = {
    config: {
      verificationStatus
    },
    const: {}
  };
};
