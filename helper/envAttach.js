const adminType = rootRequire('config/admin.type.js');
const clientType = rootRequire('config/client.type.js');
const nodeEnvironment = rootRequire('config/node.environment.js');
const suspensionStatus = rootRequire('config/suspension.status.js');
const verificationStatus = rootRequire('config/verification.status.js');

const userRealm = 'User';
const adminRealm = 'Admin';
const domainName = '@6ghadam.com';
const authenticationTryCount = 5;
const authenticationAttemptsThresholdTime = 60 * 1000;
const authenticationVerifiedTime = 3 * 24 * 60 * 60 * 1000;
const smsAPIBaseURL = 'https://api.kavenegar.com/v1/@/verify/lookup.json';
const smsAPIToken = 
  '33434D58303256744D72316F674A54755734616176413D3D';
const authenticationTemplate = 'VerificationNo1';

module.exports = server => {
  server.vars = {
    config: {
      adminType,
      clientType,
      nodeEnvironment,
      suspensionStatus,
      verificationStatus
    },
    const: {
      userRealm,
      adminRealm,
      domainName,
      authenticationTryCount,
      authenticationAttemptsThresholdTime,
      authenticationVerifiedTime,
      smsAPIBaseURL,
      smsAPIToken,
      authenticationTemplate
    }
  };
};
