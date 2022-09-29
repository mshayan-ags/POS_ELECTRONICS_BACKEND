async function Customer(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.customer.findMany({
		where: {
			adminId: adminId, isDeleted: false,
		}
	});
}

function CustomerInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.customer.findUnique({
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
	Customer,
	CustomerInfo
};
