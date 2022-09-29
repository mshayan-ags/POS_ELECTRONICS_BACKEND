
const { QuantityTotal, CalculateCustomerBalance } = require("../../../utils/Calculate");

async function CreateSale(parent, args, context, info) {
	try {
		const { userId, Role, adminId, prisma } = context;
		if (!userId) {
			throw new Error("You must be Logged in");
		}
		const Products = JSON.parse(JSON.stringify(args.Product));

		// Create Sale
		const Sale = await prisma.sale.create({
			data: {
				discount: args.discount,
				...args.customerId && {
					Customer: {
						connect: {
							id: args.customerId
						}
					},
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
				if (!SerialNo?.SerialNo || SerialNo?.SaleOfProduct?.id) {
					throw new Error(`Sale did'nt Created As Serial No : - ${SerialNo?.SerialNo} is Either User or Not Available`);
				}
			})
		}

		Products.map(async (pro) => {
			await prisma.saleOfProduct.create({
				data: {
					SaleId_ProductId: `${Sale.id}_${pro.ProductId}`,
					Products: {
						connect: {
							id: pro.ProductId
						}
					},
					Sale: {
						connect: {
							id: Sale.id
						}
					},
					SerialNo: {
						connect: (pro.SerialNo.map((ser) => {
							return (
								{
									SerialNo_ProductId: `${ser}_${pro.ProductId}`,
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
					TotalQuantity: pro.ProductQuantity,
					price: pro.Price
				}
			});
		});

		// Calculate Total
		const Total = await QuantityTotal(Products, "ProductId", prisma);
		const Discount = Total - args.discount;

		await prisma.sale.update({
			where: {
				id: Sale.id
			},
			data: {
				total: Discount,
			}
		});

		if (args.AmountPayed > 0) {
			await prisma.payment.create({
				data: {
					BillNo: Sale.id,
					Amount: args.AmountPayed,
					type: args.PaymentType,
					Sale: { connect: { id: Sale.id } },
					...args.customerId && {
						PaymentReceived: { connect: { id: args.customerId } },
					},
					Admin: { connect: { id: adminId } },
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
		}

		if (args.customerId) {
			CalculateCustomerBalance(args.customerId, prisma);
		}

		return {
			success: true,
			message: "Sale Created Successfully...",
			debugMessage: Sale.id
		};
	} catch (e) {
		return {
			success: false,
			message: "Sale did'nt Created Successfully...",
			debugMessage: e.message
		};
	}
}

async function UpdateSale(parent, args, context, info) {
	try {
		// await prisma.saleOfProduct.deleteMany();
		// await prisma.sale.deleteMany();

		const { userId, adminId, Role, prisma } = context;

		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (Role == "Admin" && adminId) {
			const Products = JSON.parse(JSON.stringify(args.Product));

			const isSaleDeleted = await prisma.sale.findUnique({
				where: {
					id: args.id
				}
			})

			if (isSaleDeleted.isDeleted) {
				throw new Error("Sale Not Found");
			}

			// Create Sale
			const Sale = await prisma.sale.update({
				where: {
					id: args.id
				},
				data: {
					discount: args.discount,
					...args.customerId && {
						Customer: {
							connect: {
								id: args.customerId
							}
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
					if (!SerialNo?.SerialNo || SerialNo?.SaleOfProduct?.id) {
						throw new Error(`Sale did'nt Created As Serial No : - ${SerialNo?.SerialNo} is Either User or Not Available`);
					}
				})
			}

			Products.map(async (pro) => {
				await prisma.saleOfProduct.update({
					where: {
						SaleId_ProductId: `${Sale.id}_${pro.ProductId}`
					},
					data: {
						SerialNo: {
							connect: (pro.SerialNo.map((ser) => {
								return (
									{
										SerialNo_ProductId: `${ser}_${pro.ProductId}`,
									}
								)
							}))
						},
						TotalQuantity: pro.ProductQuantity,
						price: pro.Price
					}
				});
			});

			// Calculate Total
			const Total = await QuantityTotal(Products, "ProductId", prisma);

			const Discount = Total - args.discount;

			await prisma.sale.update({
				where: {
					id: Sale.id
				},
				data: {
					total: Discount,
				}
			});

			if (args.AmountPayed > 0) {
				await prisma.payment.create({
					data: {
						BillNo: Sale.id,
						Amount: args.AmountPayed,
						type: args.PaymentType,
						Sale: { connect: { id: Sale.id } },
						...args.customerId && {
							PaymentReceived: { connect: { id: args.customerId } },
						},
						Admin: { connect: { id: adminId } },
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
			}

			if (args.customerId) {
				CalculateCustomerBalance(args.customerId, prisma);
			}

			return {
				success: true,
				message: "Sale Updated Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Sale did'nt Updated Successfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Sale did'nt Updated Successfully...",
			debugMessage: e.message
		};
	}
}

async function DeleteSale(parent, args, context, info) {
	try {
		// await prisma.saleOfProduct.deleteMany();
		// await prisma.sale.deleteMany();

		const { adminId, Role, prisma } = context;
		if (!adminId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		}
		// Create Sale
		else if (Role == "Admin" && adminId) {
			const GetCustomer = prisma.sale
				.findUnique({
					where: {
						id: args.id
					}
				})
				.Customer();
			const GetProduct = prisma.sale
				.findUnique({
					where: {
						id: args.id
					}
				})
				.Product();

			const OBJ = { GetProduct: await GetProduct, GetCustomer: await GetCustomer }

			await prisma.saleOfProduct.updateMany({
				where: {
					SaleId: args.id
				},
				data: {
					isDeleted: true,
				}
			});

			await prisma.saleReturn.updateMany({
				where: {
					SaleId: args.id
				},
				data: {
					isDeleted: true,
				}
			});
			await prisma.sale.update({
				where: {
					id: args.id
				},
				data: {
					isDeleted: true,
				}
			});
			await prisma.payment.updateMany({
				where: {
					BillNo: args.id
				},
				data: {
					isDeleted: true,
				}
			})

			if (OBJ?.GetCustomer?.id) {
				CalculateCustomerBalance(OBJ.GetCustomer.id, prisma);
			}

			await QuantityTotal(OBJ.GetProduct, "ProductId", prisma);

			return {
				success: true,
				message: "Sale Deleted Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Sale Delete Only Allowed To Admin..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Sale did'nt Deleted Successfully...",
			debugMessage: e.message
		};
	}
}

async function ReturnSale(parent, args, context, info) {
	try {
		// await prisma.saleOfProduct.deleteMany();
		// await prisma.sale.deleteMany();

		const { userId, Role, adminId, prisma } = context;

		if (!userId && Role !== "Admin") {
			throw new Error("You must be Logged in");
		} else if (Role == "Admin" && userId) {
			const Products = JSON.parse(JSON.stringify(args.Product));
			const GetSale = await prisma.sale.findUnique({
				where: {
					id: args.id
				}
			});

			if (GetSale.isDeleted) {
				throw new Error("Sale Not Found");
			}

			// Create Sale
			const Sale = await prisma.sale.update({
				where: {
					id: args.id
				},
				data: {
					discount: args.discount,
					...args.customerId && {
						Customer: {
							connect: {
								id: args.customerId
							}
						}
					}
				}
			});

			Products.map(async (pro) => {
				await prisma.saleReturn.create({
					data: {
						SaleId_ProductId: `${Sale.id}_${pro.ProductId}`,
						Products: {
							connect: {
								id: pro.ProductId
							}
						},
						Sale: {
							connect: {
								id: args.id
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
						TotalQuantity: pro.ProductQuantity,
						price: pro.Price
					}
				});
			});

			// Calculate Total
			const OldTotal = GetSale.total;
			const Total = await QuantityTotal(Products, "ProductId", prisma);

			const Discount = OldTotal - Number(Total - args.discount);

			await prisma.sale.update({
				where: {
					id: Sale.id
				},
				data: {
					total: Discount,
				}
			});

			if (args.AmountPayed > 0) {
				await prisma.payment.create({
					data: {
						BillNo: Sale.id,
						Amount: -Number(args.AmountPayed),
						type: args.PaymentType,
						Sale: { connect: { id: Sale.id } },
						...args.customerId && {
							PaymentReceived: { connect: { id: args.customerId } },
						},
						Admin: { connect: { id: adminId } },
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
			}
			if (args.customerId) {
				CalculateCustomerBalance(args.customerId, prisma);
			}

			return {
				success: true,
				message: "Sale Returned Successfully..."
			};
		} else {
			return {
				success: false,
				message: "Sale did'nt Returned Successfully..."
			};
		}
	} catch (e) {
		return {
			success: false,
			message: "Sale did'nt Updated Successfully...",
			debugMessage: e.message
		};
	}
}

module.exports = {
	CreateSale,
	UpdateSale,
	DeleteSale,
	ReturnSale
};
