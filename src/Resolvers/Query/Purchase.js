async function Purchase(parent, args, context, info) {
	const { adminId, userId, Role, prisma } = context;

	return prisma.purchase.findMany({
		where: {
			adminId: adminId,
			...(Role == "User" && {
				userId: userId
			}),
		}
	});
}

function PurchaseInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.purchase.findUnique({
		where: {
			id: args.id
		}
	});
}

async function PurchaseOfProduct(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.purchaseOfProduct.findMany({ where: { adminId: adminId } });
}

function PurchaseOfProductInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.purchaseOfProduct.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Purchase,
	PurchaseInfo,
	PurchaseOfProduct,
	PurchaseOfProductInfo
};
