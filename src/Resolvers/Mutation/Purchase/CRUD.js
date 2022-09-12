
const { QuantityTotal, CalculateVendorBalance } = require("../../../utils/Calculate");

async function CreatePurchase(parent, args, context, info) {
	try {
		// await prisma.purchaseOfProduct.deleteMany();
		// await prisma.purchase.deleteMany();

		const { userId, Role, adminId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		else {
			const Products = JSON.parse(JSON.stringify(args.Product));

			// Create Purchase
			const Purchase = await prisma.purchase.create({
				data: {
					discount: args.discount,
					BillNo: args.BillNo,
					Vendor: {
						connect: {
							id: args.vendorId
						}
					},
					Admin: {
						connect: {
							id: adminId
						}
					},
					...(Role == "User"
						&& {
						User: {
							connect: {
								id: userId
							}
						},
					}),
				}
			});

			for (let index = 0; index < Products.length; index++) {
				const Product = Products[index];
				Product.SerialNo.map(async (ser) => {
					const SerialNo = await prisma.serialNo.findUnique({
						where: {
							SerialNo_ProductId: `${ser}_${Product.ProductId}`,
						}
					})
					if (SerialNo?.SerialNo == ser) {
						throw new Error(`Purchase did'nt Created As Serial No : - ${SerialNo?.SerialNo} Already in Use`);
					}
				})
			}

			Products.map(async (pro) => {
				await prisma.purchaseOfProduct.create({
					data: {
						PurchaseId_ProductId: `${Purchase.id}_${pro.ProductId}`,
						Products: {
							connect: {
								id: pro.ProductId
							}
						},
						Purchase: {
							connect: {
								id: Purchase.id
							}
						},
						SerialNo: {
							create: (pro.SerialNo.map((ser) => {
								return (
									{
										SerialNo: ser,
										SerialNo_ProductId: `${ser}_${pro.ProductId}`,
										Products: {
											connect: {
												id: pro.ProductId
											}
										},
										Admin: {
											connect: {
												id: adminId
											}
										},
									}
								)
							}))
						},
						Admin: {
							connect: {
								id: adminId
							}
						},
						...(Role == "User"
							&& {
							User: {
								connect: {
									id: userId
								}
							},
						}),
						Quantity: pro.ProductQuantity,
						price: pro.Price
					}
				});
			});


			// Calculate Total
			const Total = await QuantityTotal(Products, "ProductId", prisma);
			const Discount = Total - args.discount;

			await prisma.purchase.update({
				where: {
					id: Purchase.id
				},
				data: {
					total: Discount,
				}
			});

			if (args.AmountPayed > 0) {
				await prisma.payment.create({
					data: {
						BillNo: Purchase.id,
						Amount: args.AmountPayed,
						type: args.PaymentType,
						Purchase: { connect: { id: Purchase.id } },
						PaymentSent: { connect: { id: args.vendorId } },
						Admin: { connect: { id: adminId } },
						...(Role == "User" && {
							User: { connect: { id: userId } }
						})
					}
				});
			}
			CalculateVendorBalance(args.vendorId, prisma);

			return {
				success: true,
				message: "Purchase Created Successfully...",
				debugMessage: Purchase.id
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Purchase did'nt Created Successfully...",
			debugMessage: e.message
		};
	}
}

async function UpdatePurchase(parent, args, context, info) {
	try {
		// await prisma.purchaseOfProduct.deleteMany();
		// await prisma.purchase.deleteMany();

		const { Role, adminId, prisma } = context;

		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (Role == "Admin" && adminId) {
			const Products = JSON.parse(JSON.stringify(args.Product));
			// Create Purchase
			const Purchase = await prisma.purchase.update({
				where: {
					id: args.id
				},
				data: {
					discount: args.discount,
					BillNo: args.BillNo,
					Vendor: {
						connect: {
							id: args.vendorId
						}
					}
				}
			});


			for (let index = 0; index < Products.length; index++) {
				const Product = Products[index];
				Product.SerialNo.map(async (ser) => {
					const SerialNo = await prisma.serialNo.findUnique({
						where: {
							SerialNo_ProductId: `${ser}_${Product.ProductId}`,
						}
					})
					if (SerialNo?.SerialNo == ser) {
						throw new Error(`Purchase did'nt Updated As Serial No : - ${SerialNo?.SerialNo} Already in Use`);
					}
				})
			}

			Products.map(async (pro) => {
				await prisma.purchaseOfProduct.update({
					where: {
						PurchaseId_ProductId: `${Purchase.id}_${pro.ProductId}`
					},
					data: {
						SerialNo: {
							create: (pro.SerialNo.map((ser) => {
								return (
									{
										SerialNo: ser,
										SerialNo_ProductId: `${ser}_${pro.ProductId}`,
										Products: {
											connect: {
												id: pro.ProductId
											}
										},
										Admin: {
											connect: {
												id: adminId
											}
										},
									}
								)
							}))
						},
						Quantity: pro.ProductQuantity,
						price: pro.Price
					}
				});
			});

			// Calculate Total
			const Total = await QuantityTotal(Products, "ProductId", prisma);

			const Discount = Total - args.discount;
			await prisma.purchase.update({
				where: {
					id: Purchase.id
				},
				data: {
					total: Discount,
				}
			});

			if (args.AmountPayed > 0) {
				await prisma.payment.create({
					data: {
						BillNo: Purchase.id,
						Amount: args.AmountPayed,
						type: args.PaymentType,
						Purchase: { connect: { id: Purchase.id } },
						PaymentSent: { connect: { id: args.vendorId } },
						Admin: { connect: { id: adminId } },
						...(Role == "User" && {
							User: { connect: { id: userId } }
						})
					}
				});
			}
			CalculateVendorBalance(args.vendorId, prisma);

			return {
				success: true,
				message: "Purchase Updated Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Purchase did'nt Updated Successfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Purchase did'nt Updated Successfully...",
			debugMessage: e.message
		};
	}
}

async function DeletePurchase(parent, args, context, info) {
	try {
		// await prisma.purchaseOfProduct.deleteMany();
		// await prisma.purchase.deleteMany();

		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		}
		// Create Purchase
		else if (Role == "Admin" && adminId) {
			const GetVendor = prisma.purchase
				.findUnique({
					where: {
						id: args.id
					}
				})
				.Vendor();
			const VendorId = (await GetVendor).id;

			const GetProduct = prisma.purchase
				.findUnique({
					where: {
						id: args.id
					}
				})
				.Product();
			const OBJ = { GetProduct: await GetProduct }

			await prisma.purchaseOfProduct.deleteMany({
				where: {
					PurchaseId: args.id
				}
			});

			await prisma.returnPurchase.deleteMany({
				where: {
					PurchaseId: args.id
				}
			});

			await prisma.purchase.delete({
				where: {
					id: args.id
				}
			});

			await prisma.payment.deleteMany({
				where: {
					BillNo: Purchase.id,
					PurchaseId: Purchase.id
				}
			})

			await QuantityTotal(OBJ.GetProduct, "ProductId", prisma);
			await CalculateVendorBalance(VendorId, prisma);

			return {
				success: true,
				message: "Purchase Deleted Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Purchase Delete Only Allowed To Admin..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Purchase did'nt Deleted Successfully...",
			debugMessage: e.message
		};
	}
}

async function ReturnPurchase(parent, args, context, info) {
	try {
		// await prisma.purchaseOfProduct.deleteMany();
		// await prisma.purchase.deleteMany();

		const { Role, adminId, userId, prisma } = context;

		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (Role == "Admin" && adminId) {
			const Products = JSON.parse(JSON.stringify(args.Product));
			const GetPurchase = await prisma.purchase.findUnique({
				where: {
					id: args.id
				}
			});
			// Create Purchase
			const Purchase = await prisma.purchase.update({
				where: {
					id: args.id
				},
				data: {
					discount: args.discount,
					BillNo: args.BillNo,
					Vendor: {
						connect: {
							id: args.vendorId
						}
					}
				}
			});

			Products.map(async (pro) => {
				await prisma.returnPurchase.create({
					data: {
						PurchaseId_ProductId: `${Purchase.id}_${pro.ProductId}`,
						Products: {
							connect: {
								id: pro.ProductId
							}
						},
						Purchase: {
							connect: {
								id: Purchase.id
							}
						},
						Quantity: pro.ProductQuantity,
						price: pro.Price,
						...(Role == "User"
							&& {
							User: {
								connect: {
									id: userId
								}
							},
						}),
					}
				});
			});

			// Calculate Total
			const OldTotal = GetPurchase.total;
			const Total = await QuantityTotal(Products, "ProductId", prisma);

			const Discount = OldTotal - Number(Total - args.discount);

			await prisma.purchase.update({
				where: {
					id: Purchase.id
				},
				data: {
					total: Discount,
				}
			});

			if (args.AmountPayed > 0) {
				await prisma.payment.create({
					data: {
						BillNo: Purchase.id,
						Amount: -Number(args.AmountPayed),
						type: args.PaymentType,
						Purchase: { connect: { id: Purchase.id } },
						PaymentSent: { connect: { id: args.vendorId } },
						Admin: { connect: { id: adminId } },
						...(Role == "User" && {
							User: { connect: { id: userId } }
						})
					}
				});
			}
			CalculateVendorBalance(args.vendorId, prisma);

			return {
				success: true,
				message: "Purchase Returned Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Purchase did'nt Returned Successfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Purchase did'nt Updated Successfully...",
			debugMessage: e.message
		};
	}
}

module.exports = {
	CreatePurchase,
	UpdatePurchase,
	DeletePurchase,
	ReturnPurchase
};
