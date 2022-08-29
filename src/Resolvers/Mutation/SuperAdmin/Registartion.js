const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../../../utils");

async function signUpSuperAdmin(parent, args, context, info) {
	try {
		const { prisma } = context;
		// 1
		const password = await bcrypt.hash(args.password, 15);

		const SuperAdmin = await prisma.superAdmin.create({
			data: {
				...args,
				password
			}
		});

		// 3
		const token = jwt.sign({ userId: SuperAdmin.id, Role: "Super Admin" }, APP_SECRET);

		// 4
		return {
			token,
			SuperAdmin
		};
	} catch (e) {
		throw new Error(e);
	}
}

async function loginSuperAdmin(parent, args, context, info) {
	try {
		const { prisma } = context;
		// 1
		const SuperAdmin = await prisma.superAdmin.findUnique({ where: { email: args.email } });
		if (!SuperAdmin) {
			throw new Error("No such Super Admin found");
		}

		// 2
		const valid = await bcrypt.compare(args.password, SuperAdmin.password);
		if (!valid) {
			throw new Error("Invalid password");
		}

		const token = jwt.sign({ userId: SuperAdmin.id, Role: "Super Admin" }, APP_SECRET);

		// 3
		return {
			token,
			SuperAdmin
		};
	} catch (e) {
		throw new Error(e);
	}
}

module.exports = {
	signUpSuperAdmin,
	loginSuperAdmin
};
