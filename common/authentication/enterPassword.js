const utility = rootRequire('helper/utility');

let createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async Authentication => {

  const vars = app.vars;

  Authentication.enterPassword = async (mobileNumber, password) => {
    let authList = await Authentication.find({
      where: {
        mobileNumber
      }
    });
    if (authList.length === 0) {
      throw createError(404);
    }
    let model = authList[0];
    if (model.status === vars.config.verificationStatus.suspended) {
      throw createError(423);
    }
    if (model.status === vars.config.verificationStatus.verified) {
      return model;
    }
    if (model.status === vars.config.verificationStatus.ready) {
      throw createError(404);
    }
    let newTryCount = Number(model.tryCount) - 1;
    let time = utility.getUnixTimeStamp();
    if (newTryCount <= 0) {
      let data = {
        status: vars.config.verificationStatus.suspended,
        date: time
      };
      await model.updateAttributes(data);
      throw createError(423);
    }
    let expireDate = Number(model.date) + Number(model.ttl);
    if (time > expireDate) {
      let data = {
        tryCount: vars.const.authenticationTryCount,
        date: time,
        status: vars.config.verificationStatus.ready
      };
      await model.updateAttributes(data);
      throw createError(404);
    }
    if (password !== model.password) {
      await model.updateAttribute('tryCount', newTryCount);
      throw createError(401);
    } else {
      let data = {
        status: vars.config.verificationStatus.verified,
        date: time
      };
      await model.updateAttributes(data);

      let User = app.models.User;
      let usersList = await User.find({
        where: { username: mobileNumber.toString() }
      });
      if (usersList.length === 0) {
        await User.create({
          username: mobileNumber.toString(),
          email: mobileNumber.toString() + '@6Ghadam.com',
          password: mobileNumber.toString()
        });
      }
      let loginResult = await User.login({
        username: mobileNumber.toString(),
        password: mobileNumber.toString()
      });
      return loginResult;
    }
  };

  Authentication.enterPassword = utility.wrapper(Authentication.enterPassword);

  Authentication.remoteMethod('enterPassword', {
    description: 'Enter the mobile number and provided\
                  password to check authentication',
    accepts: [{
        arg: 'mobileNumber',
        type: 'string',
        required: true,
        http: {
          source: 'path'
        }
      },
      {
        arg: 'password',
        type: 'string',
        required: true,
        http: {
          source: 'path'
        }
      }
    ],
    http: {
      path: '/enterPassword/:mobileNumber/:password',
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