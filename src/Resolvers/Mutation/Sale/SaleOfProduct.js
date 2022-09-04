function Sale(parent, args, context) {
	const { prisma } = context;
	return prisma.saleOfProduct
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { Sale: true }
		})
		.Sale();
}
function Products(parent, args, context) {
	const { prisma } = context;
	return prisma.saleOfProduct
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { Products: true }
		})
		.Products();
}

function User(parent, args, context) {
	const { prisma } = context;
	return prisma.saleOfProduct
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { User: true }
		})
		.User();
}
function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.saleOfProduct
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { Admin: true }
		})
		.Admin();
}
function SerialNo(parent, args, context) {
	const { prisma } = context;
	return prisma.saleOfProduct
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { SerialNo: true }
		})
		.SerialNo();
}

module.exports = {
	Products,
	Sale,
	User,
	Admin,
	SerialNo
};
