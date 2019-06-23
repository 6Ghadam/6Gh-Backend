const utility = rootRequire('helper/utility');
const validator = rootRequire('helper/validator');

const createError = require('http-errors');

let app = rootRequire('server/server');

module.exports = async User => {

  // Load the variables from the application server
  const vars = app.vars;

  // Before Remote Create Logic 
  User.createUserBeforeRemoteLogic = async ctx => {
    // Validator to check data inputs inside the payload
    validator(ctx.args.data, {
      required: ['email', 'username', 'password', 'type'],
      white: ['email', 'username', 'password', 'type']
    });
    // No one should be able to create another founder role
    if (ctx.args.data.type === vars.config.adminType.founder) {
      throw createError(403);
    }
    // Add required patameters to data input
    ctx.args.data.emailVerified = true;
    ctx.args.data.realm = vars.const.adminRealm;
  };

  // Wrapp the function inside the Try/Catch
  User.createUserBeforeRemoteLogic = 
    utility.wrapper(User.createUserBeforeRemoteLogic);

  // Embed createUserLogic to User Create Before Remote
  User.beforeRemote('create', User.createUserBeforeRemoteLogic);

  // After Remote Create Logic 
  User.createUserAfterRemoteLogic = async (ctx, modelInstance) => {
    // LoadRoleMapping models
    let RoleMapping = User.app.models.RoleMapping;
    // Create a role for this user 
    let role = app.adminRoles.contentRole;
    if (modelInstance.type === vars.config.adminType.support) {
      role = app.adminRoles.supportRole;
    }
    // Create a principal user for this role
    await role.principals.create({
      principalType: RoleMapping.USER,
      principalId: modelInstance.id.toString()
    });
  };

  // Wrapp the function inside the Try/Catch
  User.createUserAfterRemoteLogic = 
    utility.wrapper(User.createUserAfterRemoteLogic);

  // Embed createUserLogic to User Create After Remote
  User.afterRemote('create', User.createUserAfterRemoteLogic);

};