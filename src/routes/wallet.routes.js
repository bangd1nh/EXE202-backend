import express from "express";
import walletController from "../controller/wallet.controller.js";

const router = express.Router();

router.get('/:userId', walletController.getWalletByUserId); 

export default router;