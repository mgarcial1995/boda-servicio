import { Router } from "express";
import {
  createGift,
  listGifts,
  selectGift,
  getGiftsByGuest
} from "../controllers/gifts.controller.js";

const router = Router();

router.post("/", createGift);
router.get("/", listGifts);
router.post("/select", selectGift);

// 🔥 NUEVA RUTA
router.get("/by-guest/:code", getGiftsByGuest);

export default router;
