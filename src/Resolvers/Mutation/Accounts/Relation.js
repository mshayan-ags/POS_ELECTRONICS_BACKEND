function Admin(parent, args, context) {
  const { prisma } = context;
  return prisma.accounts.findUnique({ where: { id: parent.id } }).Admin();
}
function User(parent, args, context) {
  const { prisma } = context;
  return prisma.accounts.findUnique({ where: { id: parent.id } }).User();
}
module.exports = {
  Admin,
  User
};
