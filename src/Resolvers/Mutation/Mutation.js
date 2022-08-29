const { signUpSuperAdmin, loginSuperAdmin } = require("./SuperAdmin/Registartion");
const { createAdmin, loginAdmin, updateAdmin, deleteAdmin, changePasswordAdmin } = require("./Admin/Registartion");
const { createUser, loginUser, updateUser, deleteUser, changePasswordUser } = require("./User/Registartion");
const { CreateCustomer, UpdateCustomer, DeleteCustomer } = require("./Customer/CRUD");
const { CreateVendor, UpdateVendor, DeleteVendor } = require("./Vendor/CRUD");
const { CreateProduct, UpdateProduct, DeleteProduct } = require("./Product/CRUD");
const {
	CreatePurchase,
	UpdatePurchase,
	DeletePurchase,
	ReturnPurchase
} = require("./Purchase/CRUD");
const { CreateSale, UpdateSale, DeleteSale, ReturnSale } = require("./Sale/CRUD");
const { ReceivePayment, SendPayment, UpdatePayment, DeletePayment } = require("./Payment/CRUD");
const { CreateExpense, UpdateExpense, DeleteExpense } = require("./Expense/CRUD");
const { CreateAccount, UpdateAccount, DeleteAccount } = require("./Accounts/CRUD");

module.exports = {
	signUpSuperAdmin,
	loginSuperAdmin,
	createAdmin,
	loginAdmin,
	updateAdmin,
	deleteAdmin,
	changePasswordAdmin,
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	changePasswordUser,
	CreateCustomer,
	UpdateCustomer,
	DeleteCustomer,
	CreateVendor,
	UpdateVendor,
	DeleteVendor,
	CreateProduct,
	UpdateProduct,
	DeleteProduct,
	CreatePurchase,
	UpdatePurchase,
	DeletePurchase,
	ReturnPurchase,
	CreateSale,
	UpdateSale,
	DeleteSale,
	ReturnSale,
	ReceivePayment,
	SendPayment,
	UpdatePayment,
	DeletePayment,
	CreateExpense,
	UpdateExpense,
	DeleteExpense,
	CreateAccount,
	UpdateAccount,
	DeleteAccount
};
