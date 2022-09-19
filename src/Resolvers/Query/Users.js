async function User(parent, args, context, info) {
	const { adminId, prisma } = context;

	return prisma.user.findMany({ where: { adminId: adminId, isDeleted: false } });
}
function loggedInUser(parent, args, context, info) {
	const { userId, Role, prisma } = context;
	if (Role !== "Admin") {
		const User = prisma.user.findUnique({
			where: { id: userId }
		});
		if (!User || User.isDeleted) {
			throw new Error("No such User found");
		}
		else {
			return User
		}
	}
	else {
		return {}
	}
}

function UserInfo(parent, args, context, info) {
	const { prisma } = context;
	const User = prisma.user.findUnique({
		where: { id: args.is }
	});
	if (!User || User.isDeleted) {
		throw new Error("No such User found");
	}
	else {
		return User
	}
}
module.exports = {
	User,
	loggedInUser,
	UserInfo
};
