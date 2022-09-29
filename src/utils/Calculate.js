
async function QuantityTotal(Products, identifier, prisma) {
	const AllProducts = [];
	let Total = 0;
	const CalculateLength = [];

	for (let index = 0; index < Products.length; index++) {
		const ProductId = Products[index]?.[identifier]
		let SaleQuantity = 0;
		let PurchaseQuantity = 0;
		let ReturnPurchaseQuantity = 0;
		let SaleReturnQuantity = 0;

		const ExtractProduct = await prisma.products.findUnique({
			where: { id: ProductId }
		});
		const ProductSales = await prisma.saleOfProduct.findMany({
			where: {
				ProductId: ProductId, isDeleted: false,
			}
		});
		ProductSales.map((a) => (SaleQuantity += a.TotalQuantity));
		const ProductPurchase = await prisma.purchaseOfProduct.findMany({
			where: { ProductId: ProductId, isDeleted: false, }
		});
		ProductPurchase.map((a) => (PurchaseQuantity += a.Quantity));

		const ProductReturnPurchase = await prisma.returnPurchase.findMany({
			where: { ProductId: ProductId, isDeleted: false, }
		});
		ProductReturnPurchase.map((a) => (ReturnPurchaseQuantity += a.Quantity));

		const ProductSalesReturn = await prisma.saleReturn.findMany({
			where: { ProductId: ProductId }
		});
		ProductSalesReturn.map((a) => (SaleReturnQuantity += a.TotalQuantity));

		let CurrQuantityAvailable = Number(Number(PurchaseQuantity) - Number(ReturnPurchaseQuantity)) - Number(Number(SaleQuantity) - Number(SaleReturnQuantity));

		if (CurrQuantityAvailable !== ExtractProduct.QuantityAvailable) {
			ExtractProduct.QuantityAvailable = CurrQuantityAvailable
			AllProducts.push(ExtractProduct);
		}
	}

	for (let index = 0; index < AllProducts.length; index++) {
		const ProductId = Products[index]?.[identifier]
		if (AllProducts[index].id === ProductId) {
			await prisma.products.update({
				where: { id: ProductId },
				data: {
					QuantityAvailable: AllProducts[index].QuantityAvailable
				}
			});
			const EachPrice = Products[index].ProductQuantity * Products[index].Price;
			Total += EachPrice;
			CalculateLength.push(EachPrice);
		}
	}
	if (CalculateLength.length == AllProducts.length) {
		return Total;
	}
}

async function CalculateVendorBalance(VendorID, prisma) {
	const Payments = await prisma.payment.findMany({ where: { vendorId: VendorID, isDeleted: false } })
	const Purchase = await prisma.purchase.findMany({ where: { vendorId: VendorID, isDeleted: false } });
	const Vendor = await prisma.vendor.findUnique({ where: { id: VendorID } });

	let PaymentSent = 0;
	let PaymentLeft = 0;

	for (let index = 0; index < Payments.length; index++) {
		PaymentSent += Number(Payments[index].Amount);
	}
	for (let index = 0; index < Purchase.length; index++) {
		PaymentLeft += Number(Purchase[index].total);
	}

	PaymentLeft += Vendor.initialBalance;

	const Balance = (await PaymentLeft) - (await PaymentSent);
	await prisma.vendor.update({
		where: { id: VendorID },
		data: {
			balance: Balance
		}
	});
}

async function CalculateCustomerBalance(customerID, prisma) {
	const Payments = await prisma.payment.findMany({ where: { customerId: customerID, isDeleted: false, } })
	const Sale = await prisma.sale.findMany({ where: { customerId: customerID, isDeleted: false, } });
	const Customer = await prisma.customer.findUnique({ where: { id: customerID, isDeleted: false, } });

	let PaymentReceived = 0;
	let PaymentLeft = 0;

	for (let index = 0; index < Payments.length; index++) {
		PaymentReceived += Number(Payments[index].Amount);
	}
	for (let index = 0; index < Sale.length; index++) {
		PaymentLeft += Number(Sale[index].total);
	}
	PaymentLeft += Customer.initialBalance;
	const Balance = (await PaymentLeft) - (await PaymentReceived);
	await prisma.customer.update({
		where: { id: customerID },
		data: {
			balance: Balance
		}
	});
}

module.exports = {
	QuantityTotal,
	CalculateVendorBalance,
	CalculateCustomerBalance
};
