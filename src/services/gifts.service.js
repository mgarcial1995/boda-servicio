import { supabase } from "../config/supabase.js";

export async function createGiftService(body) {
  const { data, error } = await supabase
    .from("gifts")
    .insert({
      name: body.name,
      description: body.description || null
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getGiftsService() {
  const { data, error } = await supabase
    .from("gifts")
    .select("*, guests(full_name, code)")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function selectGiftService({ code, gift_id }) {
  // Verificar invitado
  const { data: guest } = await supabase
    .from("guests")
    .select("id")
    .eq("code", code)
    .single();

  if (!guest) throw new Error("Invitado no encontrado");

  // Verificar regalo disponible
  const { data: gift } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", gift_id)
    .single();

  if (!gift) throw new Error("Regalo no encontrado");

  if (gift.status !== "available") {
    throw new Error("Regalo ya elegido");
  }

  // Actualizar estado
  const { data, error } = await supabase
    .from("gifts")
    .update({
      status: "selected",
      selected_by_guest_id: guest.id
    })
    .eq("id", gift_id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

