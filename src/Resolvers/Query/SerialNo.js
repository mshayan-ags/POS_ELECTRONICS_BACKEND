async function SerialNo(parent, args, context, info) {
  const { adminId, prisma } = context;

  return await prisma.serialNo.findMany({
    where: {
      adminId: adminId,
    }
  });
}

async function SerialNoInfo(parent, args, context, info) {
  const { prisma } = context;
  const SerialNo =await prisma.serialNo.findUnique({
    where: {
      SerialNo: args.SerialNo
    }
  });
  console.log(SerialNo)
  if (SerialNo) {
    return SerialNo
  } else {
    return {
      SerialNo: SerialNo
    }
  }
}

module.exports = {
  SerialNo,
  SerialNoInfo
};
