
async function Calculation(parent, args, context, info) {
	const { adminId, Role, userId, prisma } = context;
	// Filter
	const Filter = {
		adminId: adminId,
		createdAt: {
			gte: new Date(args.startDate),
			lt: new Date(args.endDate),
		},
		...(Role !== "Admin" && {
			userId: userId
		}),
		isDeleted: false,
	};


	// Accounts
	const Accounts = await prisma.accounts.findMany({
		where: Filter
	});

	// Purchase History
	const Purchase = await prisma.purchase.findMany({
		where: Filter
	});
	// Sale History
	const Sale = await prisma.sale.findMany({
		where: Filter
	});

	// Discount Given
	let DiscountGiven = 0;
	let DiscountReceived = 0;
	let TotalSale = 0;
	let TotalPurchase = 0;

	for (let index = 0; index < Sale.length; index++) {
		DiscountGiven += Number(Sale[index].discount);
		TotalSale += Number(Sale[index].total);
	}

	for (let index = 0; index < Purchase.length; index++) {
		DiscountReceived += Number(Purchase[index].discount);
		TotalPurchase += Number(Purchase[index].total);
	}

	// Profit
	const Profit = Number(TotalSale - DiscountGiven) - Number(TotalPurchase - DiscountReceived);

	// Sold Product Count
	let ProductsSold = 0;

	const ProductSale = await prisma.saleOfProduct.findMany({
		where: Filter
	});

	for (let index = 0; index < ProductSale.length; index++) {
		ProductsSold += Number(ProductSale[index].TotalQuantity);
	}

	// Purchase Product Count
	let ProductsPurchased = 0;

	const ProductPurchase = await prisma.purchaseOfProduct.findMany({
		where: Filter
	});

	const Product = await prisma.products.findMany({
		where: { id: adminId }
	});
	for (let index = 0; index < ProductPurchase.length; index++) {
		ProductsPurchased += Number(ProductPurchase[index].Quantity);
	}

	for (let index = 0; index < Product.length; index++) {
		ProductsPurchased += Number(Product[index].initialQuantity);
	}
	//Payment Received And Done

	let PaymentReceived = 0;
	let PaymentDone = 0;
	let CashPurchase = 0;
	let CashSale = 0;

	const Payment = await prisma.payment.findMany({
		where: Filter
	});

	for (let index = 0; index < Payment.length; index++) {
		if (Payment[index].customerId) {
			PaymentReceived += Number(Payment[index].Amount);
			if (Payment[index].type == "Cash") {
				CashSale += Number(Payment[index].Amount);
			}
		}
		else if (Payment[index].vendorId) {
			PaymentDone += Number(Payment[index].Amount);
			if (Payment[index].type == "Cash") {
				CashPurchase += Number(Payment[index].Amount);
			}
		}
		else if (!Payment[index].vendorId && !Payment[index].customerId) {
			PaymentReceived += Number(Payment[index].Amount);
			if (Payment[index].type == "Cash") {
				CashSale += Number(Payment[index].Amount);
			}
		}
	}

	// Customer Balance
	const Customer = await prisma.customer.findMany({
		where: { id: adminId }
	});

	let CustomerBalance = 0;

	for (let index = 0; index < Customer.length; index++) {
		CustomerBalance += Number(Customer[index].balance);
	}

	// Vendor Balance
	const Vendor = await prisma.vendor.findMany({
		where: { id: adminId }
	});

	let VendorBalance = 0;

	for (let index = 0; index < Vendor.length; index++) {
		VendorBalance += Number(Vendor[index].balance);
	}

	// Expenses
	const ExpenseArr = await prisma.expense.findMany({
		where: Filter
	});

	let Expense = 0;

	for (let index = 0; index < ExpenseArr.length; index++) {
		Expense += Number(ExpenseArr[index].Amount);
	}


	let OpeningBalance = 0
	let ClosingBalance = 0

	for (let index = 0; index < Accounts.length; index++) {
		OpeningBalance += Number(Accounts[index].OpeningBalance)
		ClosingBalance += Number(Accounts[index].ClosingBalance)
	}


	// Total Balance

	const TotalBalance =
		Number(Number(await PaymentReceived) + Number(await OpeningBalance)) - Number(Number(await PaymentDone) + Number(await Expense) + Number(await ClosingBalance));

	return {
		Purchase,
		Sale,
		TotalSale,
		TotalPurchase,
		DiscountGiven,
		DiscountReceived,
		ProductsSold,
		ProductsPurchased,
		Profit,
		PaymentReceived,
		PaymentDone,
		CustomerBalance,
		VendorBalance,
		Expense,
		TotalBalance,
		OpeningBalance,
		ClosingBalance,
		CashPurchase,
		CashSale
	};
}

module.exports = {
	Calculation
};
