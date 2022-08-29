async function Vendor(parent, args, context, info) {
	const { adminId, prisma } = context;
	return prisma.vendor.findMany({ where: { adminId: adminId } });
}

function VendorInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.vendor.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Vendor,
	VendorInfo
};
