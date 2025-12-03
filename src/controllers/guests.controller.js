import {
  createGuestService,
  getGuestByCodeService,
  confirmGuestService,
} from "../services/guests.service.js";

export async function createGuest(req, res) {
  try {
    const adminSecret = req.headers["x-admin-secret"];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.body.full_name) {
      return res.status(400).json({ error: "full_name es requerido" });
    }

    if (typeof req.body.is_family !== "boolean") {
      return res.status(400).json({
        error: "El campo is_family (true/false) es requerido"
      });
    }

    const result = await createGuestService(req.body);
    return res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export async function getGuestByCode(req, res) {
  try {
    const result = await getGuestByCodeService(req.params.code);
    if (!result)
      return res.status(404).json({ error: "Invitado no encontrado" });

    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function confirmAttendance(req, res) {
  try {
    const { code, attending, gifts } = req.body;

    const result = await confirmGuestService(code, attending, gifts);
    if (!result) return res.status(404).json({ error: "Invitado no encontrado" });

    return res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

