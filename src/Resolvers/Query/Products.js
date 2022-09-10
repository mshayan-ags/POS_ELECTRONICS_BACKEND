const { QuantityTotal } = require("../../utils/Calculate");

async function Products(parent, args, context, info) {
	const { adminId, prisma } = context;
	const AllProducts = await prisma.products.findMany({ where: { adminId: adminId } });
	await QuantityTotal(AllProducts, "id", prisma)
	return AllProducts
}

async function ProductInfo(parent, args, context, info) {
	const { prisma } = context;
	const Product = await prisma.products.findUnique({
		where: {
			id: args.id
		}
	});
	await QuantityTotal(Product, "id", prisma)
	return Product
}


function ProductSerialNoInfo(parent, args, context, info) {
	const { prisma } = context;
	return prisma.products.findUnique({
		where: {
			serialNo: {
				contains: args.serialNo,
			}
		}
	});
}

module.exports = {
	Products,
	ProductInfo,
	ProductSerialNoInfo
};
