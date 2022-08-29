async function Accounts(parent, args, context, info) {
	const { adminId, Role, userId, prisma } = context;

	return await prisma.accounts.findMany({
		where: {
			adminId: adminId,
			...(Role == "User" && {
				userId: userId
			}),
			createdAt: {
				gte: new Date(args.startDate),
				lt: new Date(args.endDate)
			}
		}
	});
}

function AccountInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.accounts.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Accounts,
	AccountInfo
};
