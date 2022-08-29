async function Payment(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.payment.findMany({ where: { adminId: adminId } });
}

function PaymentInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.payment.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Payment,
	PaymentInfo
};
