const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	const User = prisma.User.findMany();
	const Admin = prisma.admin.findMany();
	const SuperAdmin = prisma.superAdmin.findMany();

	return {
		User,
		Admin,
		SuperAdmin
	};
}

main()
	.then((result) => console.log("data", result))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
