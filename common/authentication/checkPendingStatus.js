const utility = rootRequire('helper/utility');

let cron = require('cron');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  const vars = app.vars;

  let checkPendingStatus = cron.job('*/10 * * * * *', async () => {
    let time = utility.getUnixTimeStamp();
    let authList = await Authentication.find({
      where: {
        status: vars.config.verificationStatus.pending
      }
    });
    for (let i = 0; i < authList.length; i++) {
      let model = authList[i];
      if (Number(model.date) + Number(model.ttl) < time) {
        let data = {
          tryCount: vars.const.authenticationTryCount,
          date: time,
          status: vars.config.verificationStatus.ready
        };
        await model.updateAttributes(data);
      }
    }
  });
  
  checkPendingStatus.start();
  
};