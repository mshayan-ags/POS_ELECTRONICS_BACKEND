async function SerialNo(parent, args, context, info) {
  const { adminId, prisma } = context;

  return await prisma.serialNo.findMany({
    where: {
      adminId: adminId,
    }
  });
}

function SerialNoInfo(parent, args, context, info) {
  const { prisma } = context;
  const SerialNo = prisma.serialNo.findUnique({
    where: {
      SerialNo: args.SerialNo
    }
  });
  if (SerialNo) {
    return SerialNo
  } else {
    return {
      SerialNo: ""
    }
  }
}

module.exports = {
  SerialNo,
  SerialNoInfo
};
