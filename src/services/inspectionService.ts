import { supabase } from "../lib/supabase";
import type { ItemStatus } from "../types/inspection";

export const fetchInspectionsService = async () => {
  const { data, error } = await supabase
    .from("inspections")
    .select(
      `*,
      rooms (
        *,
        items (
          *,
          annotations (*),
          photos (*)
        )
      )`
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar vistorias:", error);
    throw error;
  }

  return data;
};

export const createInspectionService = async (
  clientName: string,
  propertyAddress: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from("inspections")
    .insert([
      {
        client_name: clientName,
        property_address: propertyAddress,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addRoomService = async (inspectionId: string, name: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .insert([{ inspection_id: inspectionId, name }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRoomService = async (roomId: string) => {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw error;
};

export const addItemService = async (roomId: string, name: string) => {
  const { data, error } = await supabase
    .from("items")
    .insert([{ room_id: roomId, name }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteItemService = async (itemId: string) => {
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
};

export const updateItemStatusService = async (
  itemId: string,
  status: ItemStatus
) => {
  const { error } = await supabase
    .from("items")
    .update({ status })
    .eq("id", itemId);

  if (error) throw error;
};

export const addAnnotationService = async (itemId: string, text: string) => {
  const { data, error } = await supabase
    .from("annotations")
    .insert([{ item_id: itemId, text }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addPhotoService = async (itemId: string, url: string) => {
  const { data, error } = await supabase
    .from("photos")
    .insert([{ item_id: itemId, url }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePhotoService = async (photoId: string) => {
  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) throw error;
};
