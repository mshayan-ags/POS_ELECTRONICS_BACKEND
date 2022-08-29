const moment = require("moment");

async function CreateAccount(parent, args, context, info) {
  const { userId, adminId, Role, prisma } = context;
  try {
    if (!userId) {
      throw new Error("You must be Logged in");
    }
    else {
      const CurrUserID = Role == "User" ? userId : args.userId
      const FindAccount = await prisma.accounts.findMany({
        where: {
          userId: userId,
          createdAt: new Date(args.Date),
        }
      })
      if (FindAccount.length > 0) {
        await prisma.accounts.updateMany({
          where: {
            id: FindAccount?.[0]?.id,
            userId: userId,
            createdAt: new Date(args.Date),
          },
          data: {
            OpeningBalance: args.OpeningBalance ? args.OpeningBalance : FindAccount?.[0]?.OpeningBalance,
            ClosingBalance: args.ClosingBalance ? args.ClosingBalance : FindAccount?.[0]?.ClosingBalance,
          }
        });
      } else {
        await prisma.accounts.create({
          data: {
            ClosingBalance: args.ClosingBalance || 0,
            OpeningBalance: args.OpeningBalance || 0,
            createdAt: new Date(moment(`${new Date().toLocaleDateString()}  00:00:00`).format("ddd MMMM DD YYYY HH:mm:ss")),
            Admin: {
              connect: {
                id: adminId
              }
            },
            User: {
              connect: {
                id: CurrUserID
              }
            }
          }
        });
      }

      return {
        success: true,
        message: "Accounts Created Succesfully..."
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "Accounts did'nt Created Succesfully...",
      debugMessage: e.message
    };
  }
}

async function UpdateAccount(parent, args, context, info) {
  const { userId, adminId, Role, prisma } = context;
  try {
    if (!userId && !adminId) {
      throw new Error("You must be Logged in");
    } else if (adminId && Role == "Admin") {
      
      const Data = { ...args }
      delete Data.id

      const UpdateAccount = await prisma.accounts.update({
        where: { id: args.id },
        data: {
          ...Data
        }
      });

      if (!UpdateAccount) {
        throw new Error("No such Accounts found");
      }

      return {
        success: true,
        message: "Accounts Updated Succesfully..."
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "Accounts did'nt Updated Succesfully...",
      debugMessage: e.message
    };
  }
}

async function DeleteAccount(parent, args, context, info) {
  const { adminId, Role, prisma } = context;
  try {
    if (!adminId && Role !== "Admin") {
      throw new Error("You must be Logged in");
    } else if (adminId && Role == "Admin") {
      const DeleteAccountData = await prisma.accounts.delete({
        where: { id: args.id }
      });

      if (!DeleteAccountData) {
        throw new Error("No such Accounts found");
      }

      return {
        success: true,
        message: "Accounts Deleted Succesfully..."
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "Accounts did'nt Deleted Succesfully...",
      debugMessage: e.message
    };
  }

}

module.exports = {
  CreateAccount,
  UpdateAccount,
  DeleteAccount
};
