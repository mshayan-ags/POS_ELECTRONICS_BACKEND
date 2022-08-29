async function Customer(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.customer.findMany({ where: { adminId: adminId } });
}

function CustomerInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.customer.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Customer,
	CustomerInfo
};
