function getGroupAdmins(participants = []) {
  let admins = [];
  for (let p of participants) {
    if (p.admin) admins.push(p.id);
  }
  return admins;
}

module.exports = { getGroupAdmins };
