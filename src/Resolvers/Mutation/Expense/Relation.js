function User(parent, args, context) {
	const { prisma } = context;
	return prisma.expense.findUnique({ where: { id: parent.id } }).User();
}

function Admin(parent, args, context) {
	const { prisma } = context;
	return prisma.expense.findUnique({ where: { id: parent.id } }).Admin();
}

module.exports = {
	User,
	Admin
};
