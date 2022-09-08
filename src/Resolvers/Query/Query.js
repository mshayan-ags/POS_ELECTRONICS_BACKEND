const { Admin, loggedInAdmin } = require("./Admin");
const { User, loggedInUser, UserInfo } = require("./Users");
const { Customer, CustomerInfo } = require("./Customer");
const { Vendor, VendorInfo } = require("./Vendor");
const { Products, ProductInfo, ProductSerialNoInfo } = require("./Products");
const { Purchase, PurchaseInfo, PurchaseOfProduct, PurchaseOfProductInfo } = require("./Purchase");
const { Sale, SaleInfo, SaleOfProduct, SaleOfProductInfo } = require("./Sale");
const { Payment, PaymentInfo } = require("./Payment");
const { Calculation } = require("./Dashboard");
const { Expense, ExpenseInfo } = require("./Expense");
const { Accounts, AccountInfo } = require("./Accounts");
const { SerialNo, SerialNoInfo } = require("./SerialNo");


module.exports = {
	Admin,
	loggedInAdmin,
	User,
	loggedInUser,
	UserInfo,
	Vendor,
	VendorInfo,
	Customer,
	CustomerInfo,
	Products,
	ProductInfo,
	ProductSerialNoInfo,
	Purchase,
	PurchaseInfo,
	PurchaseOfProduct,
	PurchaseOfProductInfo,
	Sale,
	SaleInfo,
	SaleOfProduct,
	SaleOfProductInfo,
	Payment,
	PaymentInfo,
	Calculation,
	Expense,
	ExpenseInfo,
	Accounts,
	AccountInfo,
	SerialNo,
	SerialNoInfo
};
