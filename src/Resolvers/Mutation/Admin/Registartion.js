const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, saveProfilePicture } = require("../../../utils");
const { emailVerification } = require("../../../utils/Mail");
const { MongoClient } = require('mongodb');

async function createAdmin(parent, args, context, info) {
	try {
		const { prisma } = context

		const Email = args.email.split("@")
		const DBName = Email[0].replace(/\./g, '')

		// Email Verification
		const isEmailVerified = await emailVerification({ email: args.email });
		if (!isEmailVerified) throw new Error('Email is not valid....');
		const isEmailExists = await prisma.admin.findMany({ where: { email: args.email } });
		if (isEmailExists.length > 0) throw new Error('Email has already been taken');
		const isUserNameExists = await prisma.admin.findMany({ where: { username: DBName } });
		if (isUserNameExists.length > 0) throw new Error('Email has already been taken');

		const client = new MongoClient(process.env.DATABASE_URL);
		const AllDataBases = await (await client.db().admin({ listDatabases: 1 }).listDatabases()).databases.filter((db) => db.name.toLowerCase() == DBName.toLowerCase())
		if (AllDataBases.length > 0) throw new Error('Please Try With Another Email as Email has already been taken');

		const prismaAdminDB = new PrismaClient({ datasources: { db: { url: `${process.env.DATABASE_URL}/${DBName}?retryWrites=true&w=majority` } } })

		const password = await bcrypt.hash(args.password, 15);
		const file = args.profilePicture
			? await Promise.resolve(saveProfilePicture(args.profilePicture)).then(async (value) => {
				return await value;
			})
			: undefined;


		const admin = await prismaAdminDB.admin.create({
			data: {
				...args,
				username: DBName,
				...(args.profilePicture
					? {
						profilePicture: {
							create: file
						}
					}
					: false),
				password
			}
		});

		await prisma.admin.create({
			data: {
				...args,
				username: DBName,
				...(args.profilePicture
					? {
						profilePicture: {
							create: file
						}
					}
					: false),
				password
			}
		});


		// 3
		const token = jwt.sign({ userId: admin.id, adminId: admin.id, Role: "Admin", username: DBName }, APP_SECRET)
		// 4
		return {
			token,
			admin
		};
	} catch (e) {
		throw new Error(e);
	}
}

async function loginAdmin(parent, args, context, info) {
	try {
		const Email = args.email.split("@")
		const DBName = Email[0].replace(/\./g, '')

		const prismaAdminDB = new PrismaClient({ datasources: { db: { url: `${process.env.DATABASE_URL}/${DBName}?retryWrites=true&w=majority` } } })

		const admin = await prismaAdminDB.admin.findUnique({ where: { email: args.email } });
		if (!admin && admin?.isDeleted) {
			throw new Error("No such admin found");
		}

		// 2
		const valid = await bcrypt.compare(args.password, admin?.password);
		if (!valid) {
			throw new Error("Invalid password");
		}

		const token = jwt.sign({ userId: admin.id, adminId: admin.id, Role: "Admin", username: DBName }, APP_SECRET);

		// 3
		return {
			token,
			admin
		};
	} catch (e) {
		throw new Error(e);
	}
}

async function updateAdmin(parent, args, context, info) {
	try {
		const { userId, adminId, Role, prisma } = context;
		if (!userId && userId !== adminId && Role == "User") {
			throw new Error("You are Not Allowed For This Action");
		}

		const file = args.profilePicture
			? await Promise.resolve(saveProfilePicture(args.profilePicture)).then(async (value) => {
				return await value;
			})
			: undefined;

		const Data = { ...args }
		delete Data.profilePicture

		const admin = await prisma.admin.findUnique({ where: { email: adminId } });
		if (!admin && admin?.isDeleted) {
			throw new Error("No such admin found");
		}

		await prisma.admin.update({
			where: {
				id: userId
			},
			data: {
				...Data,
				...(args.profilePicture
					? {
						profilePicture: {
							create: file
						}
					}
					: false),
			}
		});

		return {
			success: true,
			message: "Admin Updated Successfully ..."
		};
	} catch (e) {
		throw new Error(e);
	}
}

async function deleteAdmin(parent, args, context, info) {
	try {
		const { userId, Role, prisma } = context;
		if (!userId && Role != "Super Admin") {
			throw new Error("You must be Logged in as Super Admin");
		} else if (userId && Role == "Super Admin") {
			const admin = await prisma.admin.update({
				where: {
					id: args.id
				},
				data: {
					isDeleted: true
				}
			});
			if (!admin && admin.isDeleted) {
				throw new Error("No such admin found");
			}

			return {
				success: true,
				message: "Admin Deleted Successfully ..."
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


async function changePasswordAdmin(parent, args, context, info) {
	try {
		const { adminId, userId, prisma } = context;
		if (adminId == userId) {
			throw new Error("You must be Logged in as Admin");
		} else {
			const admin = await prisma.admin.findUnique({
				where: {
					id: userId
				}
			});

			if (!admin && admin?.isDeleted) {
				throw new Error("No such admin found");
			}

			const valid = await bcrypt.compare(args.oldPassword, admin.password);
			if (!valid) {
				throw new Error("Invalid password");
			}

			const newPassword = await bcrypt.hash(args.newPassword, 15);

			await prisma.admin.update({
				where: {
					id: args.id
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
	createAdmin,
	loginAdmin,
	updateAdmin,
	deleteAdmin,
	changePasswordAdmin
};
