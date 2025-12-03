import {
  createGiftService,
  getGiftsService,
  selectGiftService,
  getGiftsByGuestService
} from "../services/gifts.service.js";

export async function createGift(req, res) {
  const adminSecret = req.headers["x-admin-secret"];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await createGiftService(req.body);
    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listGifts(req, res) {
  try {
    const result = await getGiftsService();
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function selectGift(req, res) {
  try {
    const result = await selectGiftService(req.body);
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 🔥 NUEVO CONTROLADOR
export async function getGiftsByGuest(req, res) {
  try {
    const { code } = req.params;
    const result = await getGiftsByGuestService(code);

    if (!result) {
      return res.status(404).json({ error: "Invitado no encontrado o sin regalos" });
    }

    res.json({ gifts: result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
