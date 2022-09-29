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
			},
			isDeleted: false,
		}
	});
}

function AccountInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.accounts.findUnique({
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
	Accounts,
	AccountInfo
};
