const { encrypt } = require("../encryption");
const { User, Admin } = require("./models");

async function register(userInfo) {
  await User.sync(); // create table if doesn't exist
  const { fullName, username, email, password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.create({
    fullName,
    username,
    email,
    password: passEncrypted,
  });
  return user;
}

async function authenticate(userInfo) {
  await User.sync();
  const { email, password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.findOne({
    where: { email, password: passEncrypted },
  });
  return user;
}

async function adminAccess(adminInfo) {
  await Admin.sync();
  const { email, password } = adminInfo;
  const passEncrypted = encrypt(password);
  const admin = await Admin.findOne({
    where: { email, password: passEncrypted },
  });
  return admin;
}

module.exports = { register, authenticate, adminAccess };

// async function adminEntry(adminInfo) {
//   await Admin.sync();
//   const { fullName, username, email, password } = adminInfo;
//   const passEncrypted = encrypt(password);
//   const admin = await Admin.create({
//     fullName,
//     username,
//     email,
//     password: passEncrypted,
//   });
//   return admin;
// }
// function adminObj(fullName, username, email, password) {
//   return {
//     fullName,
//     username,
//     email,
//     password,
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
// ];
// fullNames.map(async (fullName, index) => {
//   const admin = adminObj(fullName, usernames[index], emails[index], "1234");
//   const adminInfo = await adminEntry(admin);
//   console.log(adminInfo);
// });
