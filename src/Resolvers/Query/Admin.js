
function Admin(parent, args, context, info) {
	const { prisma } = context;
	return prisma.admin.findMany();
}

async function loggedInAdmin(parent, args, context, info) {
	const { adminId, prisma } = context;

	return await prisma.admin.findUnique({
		where: { id: adminId }
	});
}
module.exports = {
	Admin,
	loggedInAdmin
};
