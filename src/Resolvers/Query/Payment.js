async function Payment(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.payment.findMany({
		where: {
			adminId: adminId, isDeleted: false,
		}
	});
}

function PaymentInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.payment.findUnique({
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
	Payment,
	PaymentInfo
};
