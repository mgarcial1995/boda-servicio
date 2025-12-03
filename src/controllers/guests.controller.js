import {
  createGuestService,
  getGuestByCodeService,
  confirmGuestService,
  getAllGuestsService,
  getAllGuestsWithGiftsService
} from "../services/guests.service.js";

import ExcelJS from "exceljs";

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
        error: "El campo is_family (true/false) es requerido",
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
    const { code, attending, gifts, other_gift, dedication } = req.body;

    const result = await confirmGuestService(
      code,
      attending,
      gifts,
      other_gift,
      dedication
    );

    if (!result)
      return res.status(404).json({ error: "Invitado no encontrado" });

    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllGuests(req, res) {
  try {
    const data = await getAllGuestsService();
    return res.json({ guests: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function exportGuestsExcel(req, res) {
  try {
    // Traer invitados con sus regalos
    const guests = await getAllGuestsWithGiftsService();

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invitados");

    // Encabezados
    worksheet.columns = [
      { header: "Nombre", key: "full_name", width: 30 },
      { header: "Es familia?", key: "is_family", width: 12 },
      { header: "Asistencia", key: "attending", width: 12 },
      { header: "Regalos", key: "gifts", width: 40 },
      { header: "Otro regalo", key: "other_gift", width: 40 },
      { header: "Link Invitación", key: "link_invitation", width: 50 },
      { header: "Confirmado el", key: "confirmed_at", width: 25 },
    ];

    // Agregar filas
    guests.forEach((guest) => {
      worksheet.addRow({
        full_name: guest.full_name,
        is_family: guest.is_family ? "Sí" : "No",
        attending:
          guest.attending === null
            ? "Pendiente"
            : guest.attending
            ? "Sí"
            : "No",
        gifts:
          guest.gifts && guest.gifts.length > 0
            ? guest.gifts.map((g) => g.name).join(", ")
            : "Ninguno",
        link_invitation: guest.link_invitation,
        confirmed_at: guest.confirmed_at || "",
        other_gift: guest.other_gift || "",
      });
    });

    // Configurar headers para descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lista_invitados.xlsx"
    );

    // Enviar Excel directo
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
