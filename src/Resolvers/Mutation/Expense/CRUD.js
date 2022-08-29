
async function CreateExpense(parent, args, context, info) {
	try {
		const { userId, Role, adminId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		else if (Role !== "Admin") {
			await prisma.expense.create({
				data: {
					...args,
					Admin: {
						connect: {
							id: adminId
						}
					},
					User: {
						connect: {
							id: await userId
						}
					}
				}
			});
		} else {
			await prisma.expense.create({
				data: {
					...args,
					Admin: {
						connect: {
							id: adminId
						}
					}
				}
			});
		}

		return {
			success: true,
			message: "Expense Received successfully..."
		};
	} catch (e) {
		return {
			success: false,
			message: "Expense did'nt Received ...",
			debugMessage: e
		};
	}
}

async function UpdateExpense(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role!== "Admin") {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {

			const Data = { ...args }
			delete Data.id

			await prisma.expense.update({
				where: {
					id: args.id
				},
				data: {
					...Data
				}
			});

			return {
				success: true,
				message: "Expense Updated successfully..."
			};
		} else {
			return {
				success: false,
				message: "Expense did'nt Updated ..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Expense did'nt Updated ...",
			debugMessage: e
		};
	}
}

async function DeleteExpense(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {
			await prisma.expense.delete({
				where: {
					id: args.id
				}
			});

			return {
				success: true,
				message: "Expense Deleted successfully..."
			};
		} else {
			return {
				success: false,
				message: "Expense did'nt Deleted ..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Expense did'nt Deleted ...",
			debugMessage: e
		};
	}
}
module.exports = {
	CreateExpense,
	UpdateExpense,
	DeleteExpense
};
