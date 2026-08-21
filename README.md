
# POS_ELECTRONICS_BACKEND – Complete Documentation

**Type:** Multi-tenant GraphQL Point-of-Sale (POS) Backend for Electronics  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema (Prisma)](#5-database-schema-prisma)
6. [Multi-Tenancy Model](#6-multi-tenancy-model)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [GraphQL Schema](#8-graphql-schema)
9. [Resolvers & Business Logic](#9-resolvers--business-logic)
10. [File Uploads & Image Serving](#10-file-uploads--image-serving)
11. [Dashboard / Calculation Logic](#11-dashboard--calculation-logic)
12. [Scripts & Running the Project](#12-scripts--running-the-project)
13. [Notable Issues & Technical Debt](#13-notable-issues--technical-debt)
14. [Entity Relationship Summary](#14-entity-relationship-summary)

---

## 1. Overview

This is a **GraphQL backend** for a multi-tenant Point of Sale system specialized for **electronics inventory** (with serial-number tracking).  

It supports a hierarchy of:

- **SuperAdmin** → manages Admins
- **Admin** → owns a complete isolated tenant (own MongoDB database)
- **Users** (roles: `Manager` | `User`) → work under an Admin

Core features include:

- Product management with unique serial numbers
- Vendor purchases + purchase returns
- Customer sales + sale returns
- Payments (receive from customers / send to vendors)
- Expenses tracking
- Accounts (opening / closing balances)
- Rich date-range dashboard calculations (profit, cash flow, balances, etc.)
- Profile pictures and product images

The repository currently has an **empty README.md**. The package name in `package.json` is still `ZubairBags_Server`, indicating the project was likely adapted from an earlier bags/retail POS system.

---

## 2. Technology Stack

| Category              | Technology                          | Version / Notes                          |
|-----------------------|-------------------------------------|------------------------------------------|
| Runtime               | Node.js                             | —                                        |
| Web Framework         | Express                             | ^4.17.3                                  |
| GraphQL Server        | Apollo Server (Express)             | apollo-server-express ^2.25.2            |
| GraphQL Core          | graphql, graphql-tools, graphql-scalars, graphql-upload | Various ^15 / ^8 / ^11 |
| ORM                   | Prisma                              | ^4.3.1                                   |
| Database              | MongoDB (via Prisma)                | mongodb+srv                              |
| Authentication        | jsonwebtoken + bcryptjs             | JWT secret hardcoded as `"POS"`          |
| File Handling         | graphql-upload + local filesystem   | Cloudinary dependency present but unused |
| Email                 | nodemailer + email-deep-validator   | SMTP placeholders                        |
| Utilities             | moment, path, http, fs              | —                                        |
| Dev Tooling           | nodemon                             | ^2.0.19                                  |
| Package Manager       | Yarn                                | yarn.lock present                        |
| Deployment            | Procfile                            | `web: npx nodemon src/index.js`          |

---

## 3. Project Structure

```
POS_ELECTRONICS_BACKEND/
├── .env                          # Environment variables (contains real credentials)
├── .gitignore
├── Procfile
├── README.md                     # Empty / minimal
├── package.json                  # name: "ZubairBags_Server"
├── yarn.lock
├── prisma/
│   ├── schema.prisma             # Complete data model
│   └── seed.js                   # Non-functional seed (only finds existing records)
└── src/
    ├── index.js                  # Entry point – Apollo Server + Express
    ├── Schema.graphql            # Full GraphQL type definitions
    ├── Express/
    │   └── file.js               # Image download route
    ├── Resolvers/
    │   ├── index.js              # Combines Query, Mutation + type resolvers
    │   ├── Mutation/
    │   │   ├── Mutation.js
    │   │   ├── SuperAdmin/
    │   │   ├── Admin/            # Registration + Relation
    │   │   ├── User/
    │   │   ├── Customer/
    │   │   ├── Vendor/
    │   │   ├── Product/          # CRUD + SerialNo + Product resolvers
    │   │   ├── Purchase/         # CRUD + ReturnPurchase + relations
    │   │   ├── Sale/             # CRUD + SaleReturn + relations
    │   │   ├── Payment/
    │   │   ├── Expense/
    │   │   ├── Accounts/
    │   │   └── Attachement/      # Typo in folder name
    │   └── Query/
    │       ├── Query.js
    │       ├── Admin.js
    │       ├── Users.js
    │       ├── Customer.js
    │       ├── Vendor.js
    │       ├── Products.js
    │       ├── Purchase.js
    │       ├── Sale.js
    │       ├── Payment.js
    │       ├── Expense.js
    │       ├── Accounts.js
    │       ├── SerialNo.js
    │       └── Dashboard.js      # Complex Calculation resolver
    └── utils/
        ├── index.js              # JWT helpers + saveImage / saveProfilePicture
        ├── Calculate.js          # QuantityTotal, CalculateCustomerBalance, etc.
        └── Mail.js               # emailVerification helper
```

---

## 4. Environment Variables

From the committed `.env` file:

```env
DATABASE_URL="mongodb+srv://POS:POSPASSWORD@pos.enxh5ry.mongodb.net"

BCRYPT_SALT=12

JWT_SECRET=cat

NODE_ENV=development
APP_PORT=6002
PORT=5200
APP_PROTOCOL=http:
APP_HOST=localhost:6002

SMTP_HOST=host
SMTP_PORT=port
SMTP_USER=email
SMTP_PASS=secret
```

> **Security Warning:** Real MongoDB credentials are committed to the repository. The JWT secret used in code is hardcoded as `"POS"` (not the `JWT_SECRET` from `.env`).

---

## 5. Database Schema (Prisma)

**Provider:** MongoDB  
**Generator:** `prisma-client-js`

### Models

#### SuperAdmin
- `id` (ObjectId)
- `name`, `email` (unique), `password`
- `createdAt`, `updatedAt`

#### Admin
- `id`, `username` (unique), `name`, `email` (unique), `password`
- `numberOfUser` (default 1)
- Relations: Sale, Purchase, SaleOfProduct, PurchaseOfProduct, Customers, Vendor, User, Expense, Payment, Products, ReturnPurchase, SaleReturn, Accounts, SerialNo
- `profilePicture` → Attachment[]
- `attachmentFilename`
- Timestamps

#### User
- `id`, `name`, `Role` (enum: Manager | User), `email` (unique), `password`
- `adminId` → Admin
- `isDeleted` (default false)
- `profilePicture` → Attachment
- Many relations (Sales, Purchases, Expenses, Payments, Accounts, etc.)
- Timestamps

#### Customer
- `id`, `name`, `phoneNumber` (unique)
- `balance`, `initialBalance` (default 0)
- `adminId` → Admin
- Relations: Sale[], Payment[]

#### Vendor
- `id`, `name`, `contactPerson`, `phoneNumber` (unique)
- `balance`, `initialBalance` (default 0)
- `adminId` → Admin
- Relations: Purchase[], Payment[]

#### Products
- `id`, `name`, `serialNo` (unique)
- `Description`, `DescriptionTwo`, `Category`
- `initialQuantity`, `QuantityAvailable`, `price`
- `image` → Attachment[]
- `adminId` → Admin
- Relations: SaleOfProduct[], PurchaseOfProduct[], ReturnPurchase[], SaleReturn[], SerialNo[]

#### SerialNo
- `id`, `SerialNo` (unique)
- `SerialNo_ProductId` (unique composite-style key)
- `ProductId` → Products
- Optional: `SaleOfProductId`, `PurchaseOfProductId`
- `adminId` → Admin

#### Sale
- `id`, `total`, `discount`
- Optional `customerId` → Customer
- `adminId`, optional `userId`
- Relations: SaleOfProduct[], Payment[], SaleReturn[]

#### SaleOfProduct
- `id`, `SaleId_ProductId` (unique)
- `SaleId`, `ProductId`
- `TotalQuantity`, `price`
- `SerialNo[]`
- `adminId`, optional `userId`

#### SaleReturn
- Similar structure to SaleOfProduct

#### Purchase
- `id`, `total`, `discount`, `BillNo` (default cuid())
- Optional `vendorId` → Vendor
- `adminId`, optional `userId`
- Relations: PurchaseOfProduct[], ReturnPurchase[], Payment[]

#### PurchaseOfProduct
- Similar to SaleOfProduct (`Quantity` instead of `TotalQuantity`)

#### ReturnPurchase
- Similar structure

#### Payment
- `id`, `BillNo`, `Amount`, `type`
- Optional links to Sale / Purchase / Customer / Vendor
- `adminId`, optional `userId`

#### Expense
- `id`, `Amount`, `Category`, `Description`
- `adminId`, optional `userId`

#### Attachment
- `id`, `mimetype`, `filename` (unique), `encoding`
- Optional links to Products / User / Admin

#### Accounts
- `id`, `OpeningBalance`, `ClosingBalance`
- `adminId`, optional `userId`

**Enum:**
```prisma
enum UserType {
  Manager
  User
}
```

---

## 6. Multi-Tenancy Model

This is a **database-per-tenant** design:

1. A central MongoDB database (named `POS`) stores SuperAdmin and Admin records.
2. When an Admin is created, the system derives a database name from the email local-part (dots removed).
3. A new MongoDB database is created/used for that Admin.
4. On every authenticated request, the context creates a **new PrismaClient** pointed at the tenant database using the `username` from the JWT.
5. All business data (products, sales, customers, etc.) lives in the tenant database.

This provides strong isolation between different shops/admins.

---

## 7. Authentication & Authorization

### JWT Flow
- Secret: hardcoded `"POS"` in `src/utils/index.js` (`APP_SECRET`).
- Token payload contains: `{ userId, adminId, Role, username }`.
- Extracted in context via `getUserId(req)`.
- Header format: `Authorization: Bearer <token>`.

### Roles
- **SuperAdmin** – can create/delete Admins
- **Admin** – full control over their tenant
- **Manager / User** – limited actions under an Admin (most mutations check Role)

### Key Checks
- Most mutations require a valid `userId`.
- Some actions (delete, certain updates) are restricted to Admin or SuperAdmin.
- Users have a soft-delete flag (`isDeleted`).

---

## 8. GraphQL Schema

### Queries

```graphql
# Users
User: [User!]!
loggedInUser: User!
UserInfo(id: String!): User!

# Admin
Admin: [Admin!]!
loggedInAdmin: Admin!

# Customer / Vendor
Customer: [Customer!]!
CustomerInfo(id: String!): Customer!
Vendor: [Vendor!]!
VendorInfo(id: String!): Vendor!

# Products
Products: [Products!]!
ProductInfo(id: String!): Products!
ProductSerialNoInfo(serialNo: String!): Products!

# Purchase / Sale
Purchase: [Purchase!]!
PurchaseInfo(id: String!): Purchase!
PurchaseOfProduct: [PurchaseOfProduct!]!
PurchaseOfProductInfo(id: String!): PurchaseOfProduct!
Sale: [Sale!]!
SaleInfo(id: String!): Sale!
SaleOfProduct: [SaleOfProduct!]!
SaleOfProductInfo(id: String!): SaleOfProduct!

# Payments / Expenses / Accounts / Serials
Payment: [Payment!]!
PaymentInfo(id: String!): Payment!
Expense: [Expense!]!
ExpenseInfo(id: String!): Expense!
Accounts(startDate: String!, endDate: String): [Accounts!]!
AccountInfo(id: String!): Accounts!
SerialNo: [SerialNo!]!
SerialNoInfo(SerialNo: String!): SerialNo!

# Dashboard
Calculation(startDate: String!, endDate: String): Calculation!
```

### Mutations (Selected)

```graphql
# SuperAdmin
signUpSuperAdmin(name: String!, email: String!, password: String!): AuthPayloadSuperAdmin!
loginSuperAdmin(email: String!, password: String!): AuthPayloadSuperAdmin!

# Admin
createAdmin(...): AuthPayloadAdmin!
loginAdmin(email: String!, password: String!): AuthPayloadAdmin!
updateAdmin(...): Status!
deleteAdmin(id: String!): Status!
changePasswordAdmin(...): Status!

# User
createUser(...): Status!
loginUser(adminEmail: String!, email: String!, password: String!): AuthPayloadUser!
updateUser(...): Status!
deleteUser(id: String!): Status!
changePasswordUser(...): Status!

# Customer / Vendor
CreateCustomer / UpdateCustomer / DeleteCustomer
CreateVendor / UpdateVendor / DeleteVendor

# Product
CreateProduct / UpdateProduct / DeleteProduct   # supports [Upload] for images

# Purchase
CreatePurchase / UpdatePurchase / DeletePurchase / ReturnPurchase

# Sale
CreateSale / UpdateSale / DeleteSale / ReturnSale

# Payment
ReceivePayment / SendPayment / UpdatePayment / DeletePayment

# Expense & Accounts
CreateExpense / UpdateExpense / DeleteExpense
CreateAccount / UpdateAccount / DeleteAccount
```

**Common types:**
- `Status { success: Boolean, message: String, debugMessage: String }`
- `AuthPayloadAdmin / AuthPayloadUser / AuthPayloadSuperAdmin`
- `input ProductArray { ProductId: String!, ProductQuantity: Int!, Price: Int, SerialNo: [String!]! }`
- `Calculation` – large object containing totals, profit, balances, cash figures, etc.

---

## 9. Resolvers & Business Logic

### Mutation Structure
All mutations are aggregated in `src/Resolvers/Mutation/Mutation.js` and implemented in domain-specific folders (`Admin/Registartion.js`, `Sale/CRUD.js`, `Purchase/CRUD.js`, etc.).

### Key Business Rules

**Serial Number Handling**
- Every sale/purchase requires an array of serial numbers.
- System checks that serial numbers exist and are not already sold.
- Serials are linked via `SerialNo_ProductId` composite key.

**Balance Updates**
- After sales, payments, or returns, `CalculateCustomerBalance` (and equivalent for vendors) recalculates running balances.

**Quantity Management**
- `QuantityTotal` helper is used to recompute product availability after sales/purchases/returns.

**Returns**
- `ReturnSale` / `ReturnPurchase` create return records and adjust totals (often with negative payment amounts).

**Admin Creation**
- Creates the Admin record in both the central database and the new tenant database.
- Derives `username` from email local-part.
- Checks for existing databases to prevent collisions.

---

## 10. File Uploads & Image Serving

- Uses `graphql-upload`.
- Max file size is set extremely high (15 TB theoretically).
- `saveImage` / `saveProfilePicture` generate a random filename and attempt to write to `./uploads`.
- **Current state:** The actual `createWriteStream` is commented out, so files are not persisted on disk in the current code.
- Express route: `GET /GetImage/:filename` serves files from `./uploads` if they exist.

Cloudinary is listed as a dependency but not used in the core flow.

---

## 11. Dashboard / Calculation Logic

The `Calculation` query (in `src/Resolvers/Query/Dashboard.js`) accepts a date range and returns a comprehensive report:

- Lists of Purchases and Sales in the period
- `TotalSale`, `TotalPurchase`
- `DiscountGiven`, `DiscountReceived`
- `ProductsSold`, `ProductsPurchased`
- `Profit` = (TotalSale − DiscountGiven) − (TotalPurchase − DiscountReceived)
- `PaymentReceived`, `PaymentDone`
- `CashSale`, `CashPurchase`
- `CustomerBalance`, `VendorBalance`
- `Expense`
- `OpeningBalance`, `ClosingBalance`
- `TotalBalance`

Filtering is done by `adminId` (and optionally `userId` for non-Admin users).

---

## 12. Scripts & Running the Project

### package.json Scripts

```json
"prisma:deploy": "prisma migrate dev --name mydb",
"prisma:seed": "prisma db seed --preview-feature",
"dev": "cross-env NODE_ENV=development nodemon src/index.js",
"start": "nodemon src/index.js",
"postup": "npm run prisma:deploy && npm run prisma:seed",
"prisma:format": "prisma format",
"preprisma:deploy": "npm run prisma:format",
"prisma": "prisma format && prisma db push && prisma generate"
```

### How to Run

1. Clone the repository.
2. Install dependencies: `yarn install` (or `npm install`).
3. Configure `.env` (especially `DATABASE_URL`).
4. Generate Prisma client: `npx prisma generate`.
5. Push schema: `npx prisma db push` (or use the provided scripts).
6. Start the server: `yarn dev` or `yarn start`.
7. GraphQL endpoint: `http://localhost:<PORT>/graphql` (Playground & introspection are enabled).
8. Image endpoint: `http://localhost:<PORT>/GetImage/:filename`.

Default port comes from `process.env.PORT` (fallback 4000).

---

## 13. Notable Issues & Technical Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| Committed `.env` with real credentials | Critical | MongoDB password is exposed |
| Hardcoded JWT secret (`"POS"`) | High | Not using the `JWT_SECRET` from `.env` |
| Image upload write stream commented out | High | Files are not actually saved |
| Folder name typo (`Attachement`) | Low | — |
| Package name still `ZubairBags_Server` | Low | — |
| Seed file is non-functional | Medium | Only queries existing data |
| Incomplete error handling | Medium | Mix of thrown errors and Status objects |
| No tests / no CI | Medium | — |
| Extremely large max upload size | Medium | Potential DoS vector |
| Mixed use of cuid() and ObjectIds | Low | — |
| Some relation resolvers and helpers are fragmented | Low | — |

---

## 14. Entity Relationship Summary

```
SuperAdmin
    │
    └── Admin (1) ──────────────┬── User (many)  [Role: Manager | User]
                                │
                                ├── Customer (many)
                                ├── Vendor (many)
                                ├── Products (many) ─── SerialNo (many)
                                │
                                ├── Sale ─── SaleOfProduct ─── SerialNo
                                │         └── SaleReturn
                                │
                                ├── Purchase ─── PurchaseOfProduct ─── SerialNo
                                │            └── ReturnPurchase
                                │
                                ├── Payment (linked to Sale / Purchase / Customer / Vendor)
                                ├── Expense
                                └── Accounts
```

---

## Conclusion

**POS_ELECTRONICS_BACKEND** is a fully functional multi-tenant GraphQL POS system designed for electronics retailers who need serial-number-level inventory control. It covers the complete sales/purchase lifecycle (including returns), payments, expenses, and reporting.

