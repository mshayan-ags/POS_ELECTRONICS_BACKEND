function Sale(parent, args, context) {
	const { prisma } = context;
	return prisma.customer.findUnique({ where: { id: parent.id } }).Sale();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.customer.findUnique({ where: { id: parent.id } }).Admin();
}
function Payment(parent, args, context) {
	const { prisma } = context;
	return prisma.customer.findUnique({ where: { id: parent.id } }).Payment();
}
module.exports = {
	Sale,
	Admin,
	Payment
};
