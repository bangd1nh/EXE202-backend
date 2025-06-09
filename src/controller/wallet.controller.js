import ApiResponse from "../utils/apiResponse.js";
import walletService from "../service/wallet.service.js";
const getWalletByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log({ userId });
    const wallet = await walletService.getWalletByUserId(userId);
    if (!wallet) return ApiResponse.notFound(res, "Wallet not found");
    return ApiResponse.success(res, wallet);
  } catch (err) {
    console.error(err);
    return ApiResponse.error(res, 500, err.message);
  }
};
export default {
  getWalletByUserId,
};
