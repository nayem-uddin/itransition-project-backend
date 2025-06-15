const { encrypt } = require("../encryption");
const { User, Admin } = require("./models");

async function register(userInfo) {
  await User.sync(); // create table if doesn't exist
  const { password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.create({ ...userInfo, password: passEncrypted });
  return user;
}

async function authenticate(userInfo) {
  await User.sync();
  const { password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.findOne({
    where: { ...userInfo, password: passEncrypted },
  });
  return user;
}

async function adminAccess(adminInfo) {
  const { password } = adminInfo;
  const passEncrypted = encrypt(password);
  const admin = await Admin.findOne({
    where: { ...adminInfo, password: passEncrypted },
  });
  return admin;
}

async function getAdminsList() {
  const admins = await Admin.findAll();
  return admins;
}

async function updateAdminStatus(idList, status) {
  const admins = await Admin.update({ status }, { where: { id: idList } });
  return admins;
}

async function deleteAdmins(selectionList) {
  const selectedIDs = selectionList.map((admin) => admin.id);
  const admins = await Admin.destroy({ where: { id: selectedIDs } });
  return admins;
}

module.exports = {
  register,
  authenticate,
  adminAccess,
  getAdminsList,
  updateAdminStatus,
  deleteAdmins,
};

// async function adminEntry(adminInfo) {
//   await Admin.sync({ force: true });
//   const { password } = adminInfo;
//   const passEncrypted = encrypt(password);
//   const admin = await Admin.create({ ...adminInfo, password: passEncrypted });
//   return admin;
// }
// function adminObj(fullName, username, email, password, status) {
//   return {
//     fullName,
//     username,
//     email,
//     password,
//     status,
//   };
// }

// const fullNames = [
//   "test",
//   "tes_t",
//   "te_st",
//   "t_est",
//   "te_s_t",
//   "t_es_t",
//   "t_e_st",
//   "t_e_s_t",
//   "tes-t",
//   "te-st",
//   "t-est",
//   "te-s-t",
//   "t-es-t",
//   "t-e-st",
//   "t-e-s-t",
// ];
// const usernames = [
//   "test",
//   "tes_t",
//   "te_st",
//   "t_est",
//   "te_s_t",
//   "t_es_t",
//   "t_e_st",
//   "t_e_s_t",
//   "tes-t",
//   "te-st",
//   "t-est",
//   "te-s-t",
//   "t-es-t",
//   "t-e-st",
//   "t-e-s-t",
// ];
// const emails = [
//   "test@example.com",
//   "tes_t@example.com",
//   "te_st@example.com",
//   "t_est@example.com",
//   "te_s_t@example.com",
//   "t_es_t@example.com",
//   "t_e_st@example.com",
//   "t_e_s_t@example.com",
//   "tes-t@example.com",
//   "te-st@example.com",
//   "t-est@example.com",
//   "te-s-t@example.com",
//   "t-es-t@example.com",
//   "t-e-st@example.com",
//   "t-e-s-t@example.com",
// ];
// fullNames.map(async (fullName, index) => {
//   const admin = adminObj(
//     fullName,
//     usernames[index],
//     emails[index],
//     "1234",
//     "active"
//   );
//   const adminInfo = await adminEntry(admin);
//   console.log(adminInfo);
// });
