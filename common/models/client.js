let app = require('../../server/server');

module.exports = async Client => {

  Client.validatesInclusionOf('status', {
    in: Object.values(app.vars.config.clientStatus),
  });

  rootRequire('common/client/resolveAccessToken')(
    Client);
  rootRequire('common/client/createGuestClient')(
    Client);
  rootRequire('common/client/updateClient')(
    Client);

};
