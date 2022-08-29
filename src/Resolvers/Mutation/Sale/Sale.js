function Customer(parent, args, context) {
	const { prisma } = context;
	return prisma.sale.findUnique({ where: { id: parent.id } }).Customer();
}
function Product(parent, args, context) {
	const { prisma } = context;
	return prisma.sale.findUnique({ where: { id: parent.id } }).Product();
}
function Payment(parent, args, context) {
	const { prisma } = context;
	return prisma.sale.findUnique({ where: { id: parent.id } }).Payment();
}
function User(parent, args, context) {
	const { prisma } = context;
	return prisma.sale.findUnique({ where: { id: parent.id } }).User();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.sale.findUnique({ where: { id: parent.id } }).Admin();
}


module.exports = {
	Payment,
	Product,
	Customer,
	User,
	Admin
};
