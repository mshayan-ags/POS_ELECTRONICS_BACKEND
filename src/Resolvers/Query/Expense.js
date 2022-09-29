async function Expense(parent, args, context, info) {
	const { adminId, userId, Role, prisma } = context;

	return prisma.expense.findMany({
		where: {
			adminId: adminId,
			...(Role == "User" && {
				userId: userId
			}),
			isDeleted: false,
		}
	});
}

function ExpenseInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.expense.findUnique({
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
	Expense,
	ExpenseInfo
};
