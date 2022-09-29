async function Vendor(parent, args, context, info) {
	const { adminId, prisma } = context;
	return prisma.vendor.findMany({
		where: {
			adminId: adminId, isDeleted: false,
 } });
}

function VendorInfo(parent, args, context, info) {
	const { prisma } = context;
	const Data = prisma.vendor.findUnique({
		where: {
			id: args.id
		}
	});
	if (!Data?.isDeleted) {
		return Data;
	} else {
		throw new Error("No Such Record Found");
	}
}

module.exports = {
	Vendor,
	VendorInfo
};
