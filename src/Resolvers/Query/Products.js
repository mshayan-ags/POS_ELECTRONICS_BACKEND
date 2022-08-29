async function Products(parent, args, context, info) {
	const { adminId, prisma } = context;
	return prisma.products.findMany({ where: { adminId: adminId } });
}

function ProductInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.products.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	Products,
	ProductInfo
};
