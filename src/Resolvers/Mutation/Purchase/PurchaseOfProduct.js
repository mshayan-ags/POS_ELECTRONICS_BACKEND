function Purchase(parent, args, context) {
	const { prisma } = context;
	return prisma.purchaseOfProduct
		.findUnique({
			where: {
				PurchaseId_ProductId: `${parent.PurchaseId}_${parent.ProductId}`
			},
			select: { Purchase: true }
		})
		.Purchase();
}
function Products(parent, args, context) {
	const { prisma } = context;
	return prisma.purchaseOfProduct
		.findUnique({
			where: {
				PurchaseId_ProductId: `${parent.PurchaseId}_${parent.ProductId}`
			},
			select: { Products: true }
		})
		.Products();
}

function User(parent, args, context) {
	const { prisma } = context;
	return prisma.purchaseOfProduct
		.findUnique({
			where: {
				PurchaseId_ProductId: `${parent.PurchaseId}_${parent.ProductId}`
			},
			select: { User: true }
		})
		.User();
}

function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.purchaseOfProduct
		.findUnique({
			where: {
				PurchaseId_ProductId: `${parent.PurchaseId}_${parent.ProductId}`
			},
			select: { Admin: true }
		})
		.Admin();
}

module.exports = {
	Products,
	Purchase,
	User,
	Admin
};
