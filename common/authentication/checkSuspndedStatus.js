const utility = rootRequire('helper/utility');

let cron = require('cron');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  // Load the variables from the application server
  const vars = app.vars;

  // Plan a cron job for every 10 seconds to check Suspended status models
  let checkSuspndedStatus = cron.job('*/10 * * * * *', async () => {
    // Get the current timestamp for further checking
    let time = utility.getUnixTimeStamp();
    // Fetch list of all the Suspended status authentication models
    let authList = await Authentication.fetchModelsWithNullOption({
      where: {
        status: vars.config.suspensionStatus.suspended
      }
    });
    // Iterate through the list of authentication models
    for (let i = 0; i < authList.length; i++) {
      let model = authList[i];
      // Check if ttl time of each model is passed from its owner's last attempt
      if (Number(model.date) + Number(model.ttl) < time) {
        // Refresh the data for this model to give its owner ability to attempt
        let data = {
          tryCount: vars.const.authenticationTryCount,
          date: time,
          status: vars.config.verificationStatus.ready
        };
        await model.updateAttributes(data);
      }
    }
  });

  // Start the cron job
  checkSuspndedStatus.start();
  
};