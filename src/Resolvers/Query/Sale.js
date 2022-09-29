async function Sale(parent, args, context, info) {
	const { adminId, userId, Role, prisma } = context;

	return prisma.sale.findMany({
		where: {
			adminId: adminId,
			...(Role == "User" && {
				userId: userId
			}),
			isDeleted: false,
		}
	});
}

function SaleInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.sale.findUnique({
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

async function SaleOfProduct(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.saleOfProduct.findMany({
		where: {
			adminId: adminId, isDeleted: false,
 } });
}

function SaleOfProductInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.saleOfProduct.findUnique({
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
	Sale,
	SaleInfo,
	SaleOfProduct,
	SaleOfProductInfo
};
