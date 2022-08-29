function Sale(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).Sale();
}
function Purchase(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).Purchase();
}
function image(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).image();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).Admin();
}
function ReturnPurchase(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).ReturnPurchase();
}
function SaleReturn(parent, args, context) {
	const { prisma } = context;
	return prisma.products.findUnique({ where: { id: parent.id } }).SaleReturn();
}

module.exports = {
	Sale,
	Purchase,
	image,
	Admin,
	ReturnPurchase,
	SaleReturn
};
