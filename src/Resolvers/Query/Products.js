const { QuantityTotal } = require("../../utils/Calculate");

async function Products(parent, args, context, info) {
	const { adminId, prisma } = context;
	const AllProducts = await prisma.products.findMany({
		where: {
			adminId: adminId, isDeleted: false,
		}
	});
	QuantityTotal(AllProducts, "id", prisma)
	return AllProducts
}

async function ProductInfo(parent, args, context, info) {
	const { prisma } = context;
	const Product = await prisma.products.findUnique({
		where: {
			id: args.id
		}
	});
	if (!Product?.isDeleted) {
		QuantityTotal(Product, "id", prisma)
		return Product
	} else {
		throw new Error("No Such Record Found");
	}
}


module.exports = {
	Products,
	ProductInfo,
};
