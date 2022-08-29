const Mutation = require("./Mutation/Mutation");
const Query = require("./Query/Query");
const Admin = require("./Mutation/Admin/Relation");
const User = require("./Mutation/User/Relation");
const Customer = require("./Mutation/Customer/Relation");
const Vendor = require("./Mutation/Vendor/Relation");
const Products = require("./Mutation/Product/Relation");
const Purchase = require("./Mutation/Purchase/Purchase");
const PurchaseOfProduct = require("./Mutation/Purchase/PurchaseOfProduct");
const ReturnPurchase = require("./Mutation/Purchase/ReturnPurchase");
const Sale = require("./Mutation/Sale/Sale");
const SaleOfProduct = require("./Mutation/Sale/SaleOfProduct");
const SaleReturn = require("./Mutation/Sale/SaleReturn");
const Payment = require("./Mutation/Payment/Relation");
const Attachment = require("./Mutation/Attachement/Attachment");
const Expense = require("./Mutation/Expense/Relation");
const Accounts = require("./Mutation/Accounts/Relation");

module.exports = {
	Query,
	Mutation,
	Admin,
	User,
	Customer,
	Vendor,
	Products,
	Purchase,
	PurchaseOfProduct,
	ReturnPurchase,
	Sale,
	SaleOfProduct,
	Payment,
	Attachment,
	Expense,
	SaleReturn,
	Accounts
};
