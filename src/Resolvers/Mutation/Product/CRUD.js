const { saveImage } = require("../../../utils");

async function CreateProduct(parent, args, context, info) {
	try {
		const { userId, adminId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		else {
			const files = args.image
				? await Promise.all(
					args.image.map(async (file) => {
						const img = await saveImage(file);
						return img;
					})
				)
				: undefined;

			await prisma.products.create({
				data: {
					...args,
					Admin: {
						connect: {
							id: adminId
						}
					},
					...(args.image
						? {
							image: {
								create: [
									...files.map((file) => {
										return {
											encoding: file.encoding,
											mimetype: file.mimetype,
											filename: file.filename
										};
									})
								]
							}
						}
						: false)
				}
			});

			return {
				success: true,
				message: "Product Created successfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Product did'nt Created ...",
			debugMessage: e.message
		};
	}
}

async function UpdateProduct(parent, args, context, info) {
	const { userId, Role, prisma } = context;
	try {
		if (!userId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		}
		else {
			const ProductData = await prisma.products.findUnique({ where: { id: args.id } });

			const files = args.image
				? await Promise.all(
					args.image.map(async (file) => {
						const img = await saveImage(file);
						return img;
					})
				)
				: ProductData.image;

			const Data = { ...args }
			delete Data.id

			const Product = await prisma.products.update({
				where: { id: args.id },
				data: {
					...Data,
					...(args.image
						? {
							image: {
								create: [
									...files.map((file) => {
										return {
											encoding: file.encoding,
											mimetype: file.mimetype,
											filename: file.filename
										};
									})
								]
							}
						}
						: false)
				}
			});
			if (!Product || Product.isDeleted) {
				throw new Error("No such Product found");
			}
			return {
				success: true,
				message: "Product Updated Successfully ..."
			};
		}
	} catch (e) {
		console.log(e)
		return {
			success: false,
			message: "Product did'nt Updated...",
			debugMessage: e.message
		};
	}
}

async function DeleteProduct(parent, args, context, info) {
	const { adminId, Role, prisma } = context;
	try {
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		}
		else if (adminId && Role == "Admin") {
			const Product = await prisma.products.update({
				where: { id: args.id },
				data: { isDeleted: true }
			});
			if (!Product) {
				throw new Error("No such Product found");
			}
			return {
				success: true,
				message: "Product Deleted Successfully ..."
			};

		}
	} catch (e) {
		return {
			success: false,
			message: "Product did'nt Deleted ...",
			debugMessage: e.message
		};
	}
}

module.exports = {
	CreateProduct,
	UpdateProduct,
	DeleteProduct
};
