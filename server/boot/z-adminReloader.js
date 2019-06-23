module.exports = async server => {

  // Load the variables from the application server
  const vars = server.vars;

  // Load User built-in model
  const User = server.models.User;

  User.validatesInclusionOf('type', {
    in: Object.values(server.vars.config.adminType),
  });

  // Load Role model from server
  let { Role, RoleMapping } = server.models;
  
  // Check existance of Founder role
  let founderRoleExistance = await Role.find({
    where: { name: vars.config.adminType.founder }
  });
  // Pick the first element of founder role list
  let founderRole = founderRoleExistance[0];
  // Create Founder foundamental role if doesn't exist
  if (!founderRoleExistance) {
    founderRole = await Role.create({ name: vars.config.adminType.founder });
    // Create founder admin model from procces environments
    let founderModel = await User.create({
      username: process.env.FOUNDER_6GHADAM_USERNAME,
      email: process.env.FOUNDER_6GHADAM_EMAIL,
      password: process.env.FOUNDER_6GHADAM_PASSWORD,
      emailVerified: true,
      realm: vars.const.adminRealm,
      type: vars.config.adminType.founder
    });
    // Create a principal user for this role
    await founderRole.principals.create({
      principalType: RoleMapping.USER,
      principalId: founderModel.id.toString()
    });
  }

  // Check existance of Support role
  let supportRoleExistance = await Role.find({
    where: { name: vars.config.adminType.support }
  });
  // Pick the first element of support role list
  let supportRole = supportRoleExistance[0];
  // Create Support foundamental role if doesn't exist
  if (!supportRoleExistance) {
    supportRole = await Role.create({ name: vars.config.adminType.support });
  }

  // Check existance of Content role
  let contentRoleExistance = await Role.find({
    where: { name: vars.config.adminType.content }
  });
  // Pick the first element of content role list
  let contentRole = contentRoleExistance[0];
  // Create Content foundamental role if doesn't exist
  if (!contentRoleExistance) {
    contentRole = await Role.create({ name: vars.config.adminType.content });
  }

  // Embed all the foundamental admin roles inside the server
  server.adminRoles = {
    founderRole,
    contentRole,
    supportRole
  };
 
  rootRequire('common/user/createUserLogic')(
    User);

};
