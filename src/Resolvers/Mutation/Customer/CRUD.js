const { CalculateCustomerBalance } = require("../../../utils/Calculate");

async function CreateCustomer(parent, args, context, info) {
	const { userId, prisma, adminId } = context;
	try {
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		else {
			const Customer = await prisma.customer.create({
				data: {
					...args,
					Admin: {
						connect: {
							id: adminId
						}
					}
				}
			});

			CalculateCustomerBalance(Customer.id, prisma);

			return {
				success: true,
				message: "Customer Created Succesfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Customer did'nt Created Succesfully...",
			debugMessage: e.message
		};
	}
}

async function UpdateCustomer(parent, args, context, info) {
	const { userId, adminId, Role, prisma } = context;
	try {
		if (!userId && !adminId) {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {

			const Data = { ...args }
			delete Data.id

			const UpdateCustomer = await prisma.customer.update({
				where: { id: args.id },
				data: {
					...Data
				}
			});

			if (!UpdateCustomer || UpdateCustomer.isDeleted) {
				throw new Error("No such Customer found");
			}

			CalculateCustomerBalance(args.id, prisma);


			return {
				success: true,
				message: "Customer Updated Succesfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Customer did'nt Updated Succesfully...",
			debugMessage: e.message
		};
	}
}

async function DeleteCustomer(parent, args, context, info) {
	const { adminId, Role, prisma } = context;
	try {
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {
			const DeleteCustomerData = await prisma.customer.update({
				where: { id: args.id },
				data: { isDeleted: true }
			});

			if (!DeleteCustomerData) {
				throw new Error("No such Customer found");
			}

			return {
				success: true,
				message: "Customer Deleted Succesfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Customer did'nt Deleted Succesfully...",
			debugMessage: e.message
		};
	}

}

module.exports = {
	CreateCustomer,
	UpdateCustomer,
	DeleteCustomer
};
