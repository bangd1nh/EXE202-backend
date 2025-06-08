import {findWalletByUserId } from "../repositories/wallet.repo.js";

const getWalletByUserId = async (userId) => {
  return await findWalletByUserId(userId);
};
export default {
    getWalletByUserId
}
