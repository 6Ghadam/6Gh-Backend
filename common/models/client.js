let app = require('../../server/server');

module.exports = async Client => {

  Client.validatesInclusionOf('status', {
    in: Object.values(app.vars.config.clientStatus),
  });

};
