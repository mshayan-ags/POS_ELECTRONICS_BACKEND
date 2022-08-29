
async function ReceivePayment(parent, args, context, info) {
	try {
		const { userId, Role, adminId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		const Sale = await prisma.sale.findUnique({ where: { id: args.BillNo } })
		if (Sale) {
			await prisma.payment.create({
				data: {
					BillNo: Sale.id,
					Amount: args.Amount,
					type: args.type,
					Sale: { connect: { id: Sale.id } },
					PaymentReceived: { connect: { id: args.customerId } },
					Admin: { connect: { id: adminId } },
					...(Role == "User" && {
						User: { connect: { id: userId } }
					})
				}
			});
		}
		return {
			success: true,
			message: "Payment Received successfully..."
		};
	} catch (e) {
		return {
			success: false,
			message: "Payment did'nt Received ...",
			debugMessage: e
		};
	}
}

async function SendPayment(parent, args, context, info) {
	try {
		const { userId, Role, adminId, prisma } = context;

		if (!userId) {
			throw new Error("You must be Logged in");
		}
		const Purchase = await prisma.purchase.findUnique({ where: { id: args.BillNo } })
		if (Purchase) {
			await prisma.payment.create({
				data: {
					BillNo: Purchase.id,
					Amount: args.Amount,
					type: args.type,
					Purchase: { connect: { id: Purchase.id } },
					PaymentSent: { connect: { id: args.vendorId } },
					Admin: { connect: { id: adminId } },
					...(Role == "User" && {
						User: { connect: { id: userId } }
					})
				}
			});
		}


		return {
			success: true,
			message: "Payment Received successfully..."
		};
	} catch (e) {
		return {
			success: false,
			message: "Payment did'nt Received ...",
			debugMessage: e
		};
	}
}

async function UpdatePayment(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {
			await prisma.payment.update({
				where: {
					id: args.id
				},
				data: {
					BillNo: args.BillNo,
					Amount: args.Amount,
					type: args.type
				}
			});

			return {
				success: true,
				message: "Payment Updated successfully..."
			};
		} else {
			return {
				success: false,
				message: "Payment did'nt Updated ..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Payment did'nt Updated ...",
			debugMessage: e
		};
	}
}

async function DeletePayment(parent, args, context, info) {
	try {
		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (adminId && Role == "Admin") {
			await prisma.payment.delete({
				where: {
					id: args.id
				}
			});

			return {
				success: true,
				message: "Payment Deleted successfully..."
			};
		} else {
			return {
				success: false,
				message: "Payment did'nt Deleted ..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Payment did'nt Deleted ...",
			debugMessage: e
		};
	}
}
module.exports = {
	ReceivePayment,
	SendPayment,
	UpdatePayment,
	DeletePayment
};
