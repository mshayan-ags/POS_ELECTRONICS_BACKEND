function Sale(parent, args, context) {
	const { prisma } = context;
	return prisma.saleReturn
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
	return prisma.saleReturn
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
	return prisma.saleReturn
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
	return prisma.saleReturn
		.findUnique({
			where: {
				SaleId_ProductId: `${parent.SaleId}_${parent.ProductId}`
			},
			select: { Admin: true }
		})
		.Admin();
}

module.exports = {
	Products,
	Sale,
	User,
	Admin
};
