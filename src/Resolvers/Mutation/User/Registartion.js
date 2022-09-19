const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, saveProfilePicture } = require("../../../utils");
const { emailVerification } = require("../../../utils/Mail");

async function createUser(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role && Role == "User") {
			throw new Error("You must be Logged in");
		}
		const numberOfUsers = await (await prisma.admin.findUnique({ where: { id: adminId } })).numberOfUser
		const AdminUsers = await (await prisma.admin.findUnique({ where: { id: adminId } }).User()).length
		if (numberOfUsers > AdminUsers) {
			const isEmailExists = await prisma.user.findMany({ where: { email: args.email } });
			if (isEmailExists.length > 0) throw new Error('Email has already been taken');

			const isEmailVerified = await emailVerification({ email: args.email });
			if (!isEmailVerified) throw new Error('Email is not valid....');

			const password = await bcrypt.hash(args.password, 15);
			const file = args.profilePicture
				? await Promise.resolve(saveProfilePicture(args.profilePicture)).then(async (value) => {
					return await value;
				})
				: undefined;

			await prisma.user.create({
				data: {
					...args,
					...(args.profilePicture
						? {
							profilePicture: {
								create: file
							}
						}
						: false),
					Admin: {
						connect: {
							id: adminId
						}
					},
					password
				}
			});


			return {
				success: true,
				message: "Congrats User Created Succesfully"
			};
		}
		else {
			return {
				success: false,
				message: "Please Upgrade Package as Your Limit to Make Users has Ended"
			};
		}

	} catch (e) {
		throw new Error(e);
	}
}

async function loginUser(parent, args, context, info) {
	try {
		const Email = args.adminEmail.split("@")
		const DBName = Email[0].replace(/\./g, '')

		const prisma = new PrismaClient({ datasources: { db: { url: `${process.env.DATABASE_URL}/${DBName}?retryWrites=true&w=majority` } } })

		const User = await prisma.user.findUnique({ where: { email: args.email } });
		if (!User || User.isDeleted) {
			throw new Error("No such User found");
		}

		// 2
		const valid = await bcrypt.compare(args.password, User.password);
		if (!valid) {
			throw new Error("Invalid password");
		}

		const token = jwt.sign({ userId: User.id, adminId: User.adminId, Role: "User", username: DBName }, APP_SECRET);

		// 3
		return {
			token,
			user: User
		};
	} catch (e) {
		throw new Error(e);
	}
}

async function updateUser(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You are Not Allowed For This Action");
		} else {
			// 1
			const file = args.profilePicture !== undefined
				? await Promise.resolve(saveProfilePicture(args.profilePicture)).then(async (value) => {
					return await value;
				})
				: null;

			const Data = { ...args }
			delete Data.id
			delete Data.profilePicture

			await prisma.user.update({
				where: {
					id: args.id
				},
				data: {
					...Data,
					...(args.profilePicture && file
						? {
							profilePicture: {
								create: file
							}
						}
						: false)
				}
			});

			return {
				success: true,
				message: "User Updated Successfully ..."
			};
		}
	} catch (e) {
		throw new Error(e);
	}
}

async function deleteUser(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in as Super Admin or Admin");
		} else if (adminId && Role && Role != "User") {
			await prisma.user.update({
				where: {
					id: args.id,
				},
				data:{
					isDeleted: true,
				}
			});
			return {
				success: true,
				message: "User Deleted Successfully ..."
			};
		} else {
			return {
				success: false,
				message: "Sorry The Action You Tried Failed ..."
			};
		}
	} catch (e) {
		throw new Error(e);
	}
}




async function changePasswordUser(parent, args, context, info) {
	try {
		const { userId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in with User");
		} else {
			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}
			});
			if (!user || user.isDeleted) {
				throw new Error("No such User found");
			}

			const valid = await bcrypt.compare(args.oldPassword, user.password);
			if (!valid) {
				throw new Error("Invalid password");
			}

			const newPassword = await bcrypt.hash(args.newPassword, 15);

			await prisma.user.update({
				where: {
					id: userId
				},
				data: {
					password: newPassword
				}
			});

			return {
				success: true,
				message: "Your Password was Changed Successfully ..."
			};
		}
	} catch (e) {
		throw new Error(e);
	}
}



module.exports = {
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	changePasswordUser
};
