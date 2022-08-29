function Products(parent, args, context) {
	const { prisma } = context;
	return prisma.attachment.findUnique({ where: { id: parent.id } }).Products();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.attachment.findUnique({ where: { id: parent.id } }).Admin();
}
function Products(parent, args, context) {
	const { prisma } = context;
	return prisma.attachment.findUnique({ where: { id: parent.id } }).Products();
}
module.exports = {
	Products,
	Admin,
	Products
};
