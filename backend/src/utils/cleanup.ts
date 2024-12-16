import db from '../config/prisma';

export const deleteExpiredTokens = async () => {
  await db.refreshToken.deleteMany({
    where: { expireAt: { lte: new Date() } },
  });
};
