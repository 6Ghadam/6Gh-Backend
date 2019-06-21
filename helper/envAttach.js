const clientType = rootRequire('config/client.type.js');
const suspensionStatus = rootRequire('config/suspension.status.js');
const verificationStatus = rootRequire('config/verifiaction.status.js');

const userRealm = 'User';
const domainName = '6ghadam.com';
const authenticationTryCount = 5;
const authenticationAttemptsThresholdTime = 60 * 1000;
const authenticationVerifiedTime = 3 * 24 * 60 * 60 * 1000;
const smsAPIBaseURL = 'https://api.kavenegar.com/v1/@/verify/lookup.json';
const smsAPIToken = 
  '33596B704E5678656A333150565A455A56645A6B55574A47723331797453492F';
const authenticationTemplate = 'VerificationNo1';

module.exports = server => {
  server.vars = {
    config: {
      clientType,
      suspensionStatus,
      verificationStatus
    },
    const: {
      userRealm,
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
