import { supabase } from "../config/supabase.js";
import { generateCode } from "../utils/generateCode.js";

const BASE_URL = "https://invitacion-boda-kappa-nine.vercel.app/";

export async function createGuestService(body) {
  const code = generateCode();
  const link_invitation = `${BASE_URL}?guest=${code}`;
  if (typeof body.is_family !== "boolean") {
    throw new Error("El campo is_family debe ser true o false");
  }
  const { data, error } = await supabase
    .from("guests")
    .insert({
      full_name: body.full_name,
      phone: body.phone || null,
      email: body.email || null,
      is_family: body.is_family,
      code,
      link_invitation,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getGuestByCodeService(code) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("code", code)
    .single();

  if (error) return null;

  return data;
}

export async function confirmGuestService(
  code,
  attending,
  gifts = [],
  other_gift = null,
  dedication = null
) {
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .update({
      attending,
      confirmed_at: new Date().toISOString(),
      other_gift: other_gift ?? null,
      dedication: dedication ?? null,
      gifts_selected: gifts.length > 0 ? gifts : null
    })
    .eq("code", code)
    .select()
    .single();

  if (guestError || !guest) return null;

  return guest;
}

export async function getAllGuestsService() {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function getAllGuestsWithGiftsService() {
  const { data: guests, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Obtener regalos por invitado
  for (const guest of guests) {
    const { data: gifts } = await supabase
      .from("gifts")
      .select("id, name, description")
      .eq("selected_by_guest_id", guest.id);

    guest.gifts = gifts || [];
  }

  return guests;
}
