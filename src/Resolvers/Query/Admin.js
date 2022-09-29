
function Admin(parent, args, context, info) {
	const { prisma } = context;
	return prisma.admin.findMany({
		where:{
			isDeleted: false,
		}
	});
}

async function loggedInAdmin(parent, args, context, info) {
	const { adminId, prisma } = context;

	const Admin =  await prisma.admin.findUnique({
		where: { id: adminId }
	});
	if (!Admin?.isDeleted) {
		return Admin;
	} else {
		throw new Error("No Such Admin Found");
	}
}
module.exports = {
	Admin,
	loggedInAdmin
};
