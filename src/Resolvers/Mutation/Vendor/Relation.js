function Purchase(parent, args, context) {
	const { prisma } = context;
	return prisma.vendor.findUnique({ where: { id: parent.id } }).Purchase();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.vendor.findUnique({ where: { id: parent.id } }).Admin();
}
function Payment(parent, args, context) {
	const { prisma } = context;
	return prisma.vendor.findUnique({ where: { id: parent.id } }).Payment();
}

module.exports = {
	Purchase,
	Admin,
	Payment
};
