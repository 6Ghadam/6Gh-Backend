const utility = rootRequire('helper/utility');

let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  const vars = app.vars;

  Authentication.requestForPassword = async mobileNumber => {
    let authList = await Authentication.find({
      where: {
        mobileNumber
      }
    });
    let rand = utility.generateRandomNumber(125000, 999999);
    let time = utility.getUnixTimeStamp();
    let data = {
      mobileNumber,
      password: rand,
      date: time,
      status: vars.config.verificationStatus.pending
    };
    if (authList.length <= 0) {
      let basicModel = await Authentication.create(data);
      await Authentication.sendSMS(mobileNumber, rand);
      return basicModel;
    } else {
      let model = authList[0];
      if (model.status === vars.config.verificationStatus.suspended) {
        throw createError(423);
      }
      if (model.status === vars.config.verificationStatus.verified) {
        return model;
      }
      let basicUpdatedModel = await model.updateAttributes(data);
      await Authentication.sendSMS(mobileNumber, rand);
      return basicUpdatedModel;
    }
  };

  Authentication.requestForPassword = 
    utility.wrapper(Authentication.requestForPassword);

  Authentication.remoteMethod('requestForPassword', {
    description: 'Enter the mobile number in\
                  order to receive the password code.',
    accepts: [{
      arg: 'mobileNumber',
      type: 'string',
      required: true,
      http: {
        source: 'path'
      }
    }],
    http: {
      path: '/requestForPassword/:mobileNumber',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};