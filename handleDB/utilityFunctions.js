function destructureProps(adminInfo) {
  const { fullName, username, email, password } = adminInfo;
  return { fullName, username, email, password };
}

function getSelectedIDs(list) {
  return list.map((item) => item.id);
}

module.exports = { destructureProps, getSelectedIDs };
