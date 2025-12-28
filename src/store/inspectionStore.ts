/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  addAnnotationService,
  addItemService,
  addPhotoService,
  addRoomService,
  createInspectionService,
  deleteItemService,
  deletePhotoService,
  deleteRoomService,
  fetchInspectionsService,
  updateItemStatusService,
} from "../services/inspectionService";
import type {
  Inspection,
  InspectionStats,
  ItemStatus,
} from "../types/inspection";

interface InspectionStore {
  inspections: Inspection[];
  currentInspection: Inspection | null;
  isLoading: boolean;

  syncInspections: () => Promise<void>;

  setCurrentInspection: (id: string) => void;
  createInspection: (
    address: string,
    clientName: string,
    userId: string
  ) => Promise<string>;

  addRoom: (roomName: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;

  addItemInspection: (roomId: string, itemName: string) => Promise<void>;
  deleteItemInspection: (roomId: string, itemId: string) => Promise<void>;

  updateItemStatus: (
    roomId: string,
    itemId: string,
    newStatus: ItemStatus
  ) => Promise<void>;

  addAnnotation: (
    roomId: string,
    itemId: string,
    text: string
  ) => Promise<void>;
  addPhoto: (roomId: string, itemId: string, photoUrl: string) => Promise<void>;
  deletePhoto: (
    roomId: string,
    itemId: string,
    photoId: string
  ) => Promise<void>;

  getInspectionStats: (inspection?: Inspection) => InspectionStats;
}

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  inspections: [],
  currentInspection: null,
  isLoading: false,

  syncInspections: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchInspectionsService();

      const formattedData: Inspection[] =
        data?.map((i: any) => ({
          id: i.id,
          clientName: i.client_name,
          propertyAddress: i.property_address,
          date: i.date,
          status: i.status as "draft" | "completed",
          rooms: i.rooms.map((r: any) => ({
            id: r.id,
            name: r.name,
            isCompleted: r.is_completed || false,
            items: r.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              status: item.status as ItemStatus,
              annotations: item.annotations || [],
              photos: item.photos || [],
            })),
          })),
        })) || [];

      set({ inspections: formattedData });

      const currentId = get().currentInspection?.id;
      if (currentId) {
        const updatedCurrent = formattedData.find((i) => i.id === currentId);
        if (updatedCurrent) set({ currentInspection: updatedCurrent });
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentInspection: (id) => {
    const inspection = get().inspections.find((i) => i.id === id);
    if (inspection) set({ currentInspection: inspection });
  },

  createInspection: async (address, clientName, userId) => {
    const newInspection = await createInspectionService(
      clientName,
      address,
      userId
    );
    await get().syncInspections();

    const created = get().inspections.find((i) => i.id === newInspection.id);
    set({ currentInspection: created || null });

    return newInspection.id;
  },

  addRoom: async (roomName) => {
    const current = get().currentInspection;
    if (!current) return;
    await addRoomService(current.id, roomName);
    await get().syncInspections();
  },

  deleteRoom: async (roomId) => {
    await deleteRoomService(roomId);
    await get().syncInspections();
  },

  addItemInspection: async (roomId, itemName) => {
    await addItemService(roomId, itemName);
    await get().syncInspections();
  },

  deleteItemInspection: async (roomId, itemId) => {
    await deleteItemService(itemId);
    await get().syncInspections();
  },

  updateItemStatus: async (roomId, itemId, newStatus) => {
    await updateItemStatusService(itemId, newStatus);
    await get().syncInspections();
  },

  addAnnotation: async (roomId, itemId, text) => {
    await addAnnotationService(itemId, text);
    await get().syncInspections();
  },

  addPhoto: async (itemId, photoUrl) => {
    await addPhotoService(itemId, photoUrl);
    await get().syncInspections();
  },

  deletePhoto: async (photoId) => {
    await deletePhotoService(photoId);
    await get().syncInspections();
  },

  getInspectionStats: (inspection) => {
    const state = get();
    const target = inspection || state.currentInspection;

    if (!target || !target.rooms || target.rooms.length === 0) {
      return {
        total: 0,
        completed: 0,
        ok: 0,
        issues: 0,
        progress: 0,
        pending: 0,
      };
    }

    const rooms = target.rooms;

    const totalItems = rooms.reduce(
      (acc, r) => acc + (r.items?.length || 0),
      0
    );
    const okItems = rooms.reduce(
      (acc, r) => acc + (r.items?.filter((i) => i.status === "ok").length || 0),
      0
    );
    const issueItems = rooms.reduce(
      (acc, r) =>
        acc + (r.items?.filter((i) => i.status === "issue").length || 0),
      0
    );
    const pendingItems = rooms.reduce(
      (acc, r) =>
        acc + (r.items?.filter((i) => i.status === "pending").length || 0),
      0
    );

    const roomsProgress = rooms.map((room) => {
      const items = room.items || [];
      if (items.length === 0) return 0;

      const completedInRoom = items.filter(
        (i) => i.status !== "pending"
      ).length;
      return (completedInRoom / items.length) * 100;
    });

    const totalProgress = Math.round(
      roomsProgress.reduce((acc, curr) => acc + curr, 0) / rooms.length
    );

    return {
      total: totalItems,
      completed: okItems + issueItems,
      ok: okItems,
      issues: issueItems,
      progress: totalProgress,
      pending: pendingItems,
    };
  },
}));
