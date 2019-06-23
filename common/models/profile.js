module.exports = async Profile => {

  rootRequire('common/profile/updateBill')(
    Profile);
  rootRequire('common/profile/updateCoin')(
    Profile);
  rootRequire('common/profile/updateDurationalScore')(
    Profile);
  rootRequire('common/profile/updateScoreLevel')(
    Profile);
  rootRequire('common/profile/updateTotalScores')(
    Profile);
  
};
