const { CalculateVendorBalance, QuantityTotal } = require("../../../utils/Calculate");

async function CreateVendor(parent, args, context, info) {
	const { userId, adminId, prisma } = context;
	if (!userId && !adminId) {
		throw new Error("You must be Logged in");
	}
	try {
		const Vendor = await prisma.vendor.create({
			data: {
				...args,
				Admin: {
					connect: {
						id: adminId
					}
				}
			}
		});
		CalculateVendorBalance(Vendor.id, prisma);
		return {
			success: true,
			message: "Vendor Created Succesfully..."
		};
	} catch (e) {
		return {
			success: false,
			message: "Vendor did'nt Created Succesfully...",
			debugMessage: e.message
		};
	}
}

async function UpdateVendor(parent, args, context, info) {
	const { adminId, Role, prisma } = context;
	try {
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		}
		else if (adminId && Role == "Admin") {
			
			const Data = { ...args }
			delete Data.id

			const UpdateVendor = await prisma.vendor.update({
				where: { id: args.id },
				data: {
					...Data
				}
			});

			CalculateVendorBalance(args.id, prisma);
			if (!UpdateVendor) {
				throw new Error("No such Vendor found");
			}
		}

		return {
			success: true,
			message: "Vendor Updated Succesfully..."
		};
	} catch (e) {
		return {
			success: false,
			message: "Vendor did'nt Updated Succesfully...",
			debugMessage: e.message
		};
	}
}

async function DeleteVendor(parent, args, context, info) {
	const { adminId, Role, prisma } = context;
	if (!adminId && Role != "Admin") {
		throw new Error("You must be Logged in");
	} else if (adminId && Role == "Admin") {
		try {
			// const Purchase = await prisma.purchase.findMany({ where: { vendorId: args.id } });
			// await prisma.payment.deleteMany({ where: { vendorId: args.id } });

			// for (let index = 0; index < Purchase.length; index++) {
			// 	const GetPurchase = await prisma.purchaseOfProduct.findMany({
			// 		where: { PurchaseId: Purchase[index].id }
			// 	});
			// 	await prisma.purchaseOfProduct.deleteMany({ where: { PurchaseId: Purchase[index].id } });
			// 	for (let index = 0; index < GetPurchase.length; index++) {
			// 		await QuantityTotal(GetPurchase[index]);
			// 	}
			// 	await prisma.purchase.delete({ where: { id: Purchase[index].id } });
			// }

			const DeleteVendorData = await prisma.vendor.delete({
				where: { id: args.id }
			});

			if (!DeleteVendorData) {
				throw new Error("No such Vendor found");
			}

			return {
				success: true,
				message: "Vendor Deleted Succesfully..."
			};
		} catch (e) {
			return {
				success: false,
				message: "Vendor did'nt Deleted Succesfully...",
				debugMessage: e.message
			};
		}
	} else {
		return {
			success: false,
			message: "Sorry The Action You Tried Failed ..."
		};
	}
}
module.exports = {
	CreateVendor,
	UpdateVendor,
	DeleteVendor
};
