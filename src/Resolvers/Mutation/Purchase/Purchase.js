function Vendor(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).Vendor();
}
function Product(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).Product();
}
function Payment(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).Payment();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).Admin();
}
function ReturnPurchase(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).ReturnPurchase();
}
function User(parent, args, context) {
	const { prisma } = context;
	return prisma.purchase.findUnique({ where: { id: parent.id } }).User();
}

module.exports = {
	Payment,
	Product,
	Vendor,
	Admin,
	ReturnPurchase,
	User
};
