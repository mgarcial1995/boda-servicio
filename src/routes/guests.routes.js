import { Router } from "express";
import {
  createGuest,
  getGuestByCode,
  confirmAttendance
} from "../controllers/guests.controller.js";

const router = Router();

// ADMIN: crear invitado
router.post("/", createGuest);

// Obtener invitado por código
router.get("/:code", getGuestByCode);

// Confirmar asistencia
router.patch("/confirm", confirmAttendance);

export default router;
