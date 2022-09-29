async function Purchase(parent, args, context, info) {
	const { adminId, userId, Role, prisma } = context;

	return prisma.purchase.findMany({
		where: {
			adminId: adminId,
			...(Role == "User" && {
				userId: userId
			}),
			isDeleted: false,
		}
	});
}

function PurchaseInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.purchase.findUnique({
		where: {
			id: args.id
		}
	});
	if (!Data?.isDeleted) {
		return Data;
	} else {
		throw new Error("No Such Record Found");
	}
}

async function PurchaseOfProduct(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.purchaseOfProduct.findMany({
		where: {
			adminId: adminId, isDeleted: false,
 } });
}

function PurchaseOfProductInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.purchaseOfProduct.findUnique({
		where: {
			id: args.id
		}
	});
	if (!Data?.isDeleted) {
		return Data;
	} else {
		throw new Error("No Such Record Found");
	}
}

module.exports = {
	Purchase,
	PurchaseInfo,
	PurchaseOfProduct,
	PurchaseOfProductInfo
};
