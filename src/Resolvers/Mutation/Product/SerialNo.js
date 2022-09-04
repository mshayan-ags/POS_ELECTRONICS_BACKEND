function PurchaseOfProduct(parent, args, context) {
	const { prisma } = context;
	return prisma.serialNo
		.findUnique({
			where: {
				SerialNo_ProductId: `${parent.SerialNo}_${parent.ProductId}`
			},
			select: { PurchaseOfProduct: true }
		})
		.PurchaseOfProduct();
}

function Products(parent, args, context) {
	const { prisma } = context;
	return prisma.serialNo
		.findUnique({
			where: {
				SerialNo_ProductId: `${parent.SerialNo}_${parent.ProductId}`
			},
			select: { Products: true }
		})
		.Products();
}

function SaleOfProduct(parent, args, context) {
	const { prisma } = context;
	return prisma.serialNo
		.findUnique({
			where: {
				SerialNo_ProductId: `${parent.SerialNo}_${parent.ProductId}`
			},
			select: { SaleOfProduct: true }
		})
		.SaleOfProduct();
}

function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.serialNo
		.findUnique({
			where: {
				SerialNo_ProductId: `${parent.SerialNo}_${parent.ProductId}`
			},
			select: { Admin: true }
		})
		.Admin();
}


module.exports = {
	Products,
	PurchaseOfProduct,
	SaleOfProduct,
	Admin,
};
