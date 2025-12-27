import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Annotation,
  Inspection,
  InspectionItem,
  ItemStatus,
  Photo,
  Room,
} from "../types/inspection";

export interface InspectionStats {
  total: number;
  completed: number;
  ok: number;
  issues: number;
  progress: number;
  pending: number;
}

//minha store de vistorias
interface InspectionStore {
  inspections: Inspection[];
  //pode ser nula, caso não tenha nenhuma Vistoria aberta
  currentInspection: Inspection | null;
  setCurrentInspection: (id: string) => void;
  createInspection: (address: string, clientName: string) => string;
  addRoom: (roomName: string) => void;
  deleteRoom: (roomId: string) => void;
  addItemInspection: (roomId: string, itemName: string) => void;
  deleteItemInspection: (roomId: string, itemId: string) => void;
  updateItemStatus: (
    roomId: string,
    itemId: string,
    newStatus: ItemStatus
  ) => void;
  addAnnotation: (roomId: string, itemId: string, text: string) => void;
  addPhoto: (roomId: string, itemId: string, photoUrl: string) => void;
  getInspectionStats: (inspection?: Inspection) => InspectionStats;
}

export const useInspectionStore = create<InspectionStore>()(
  persist(
    (set, get) => ({
      inspections: [], // Começa vazio
      currentInspection: null,

      createInspection: (address, clientName) => {
        const id = uuidv4();
        const newInspection: Inspection = {
          id,
          clientName,
          propertyAddress: address,
          date: Date.now(),
          status: "draft",
          rooms: [],
        };

        set((state) => ({
          currentInspection: newInspection,
          inspections: [newInspection, ...state.inspections],
        }));

        console.log("Nova vistoria criada:", newInspection);
        return id;
      },

      setCurrentInspection: (id) => {
        const state = get();
        const found = state.inspections.find((i) => i.id === id);

        if (found) {
          const updated = { ...found, date: Date.now() };

          const otherInspections = state.inspections.filter((i) => i.id !== id);

          set({
            currentInspection: updated,
            inspections: [updated, ...otherInspections],
          });
        }
      },

      addRoom: (roomName) =>
        set((state) => {
          if (!state.currentInspection) return state;

          const newRoom: Room = {
            id: uuidv4(),
            name: roomName,
            isCompleted: false,
            items: [],
          };

          const updatedInspection = {
            ...state.currentInspection,
            rooms: [...state.currentInspection.rooms, newRoom],
          };

          return {
            currentInspection: updatedInspection,

            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        }),

      deleteRoom: (roomId) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.filter(
            (r) => r.id !== roomId
          );

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        });
      },

      addItemInspection: (roomId, itemName) =>
        set((state) => {
          if (!state.currentInspection) return state;

          const newInspectionItem: InspectionItem = {
            id: uuidv4(),
            name: itemName,
            status: "pending",
            annotations: [],
            photos: [],
          };

          const updatedRooms = state.currentInspection.rooms.map((room) => {
            if (room.id === roomId) {
              return { ...room, items: [...room.items, newInspectionItem] };
            }
            return room;
          });

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        }),

      deleteItemInspection: (roomId, itemId) =>
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.map((room) => {
            if (room.id !== roomId) return room;

            return {
              ...room,
              items: room.items.filter((i) => i.id !== itemId),
            };
          });

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        }),

      updateItemStatus: (roomId, itemId, newStatus) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const updatedItems = room.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, status: newStatus };
            });
            return { ...room, items: updatedItems };
          });

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        });
      },

      addAnnotation: (roomId, itemId, text) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const updatedItem = room.items.map((item) => {
              if (item.id !== itemId) return item;
              const newAnnotation: Annotation = {
                id: uuidv4(),
                text: text,
                timestamp: Date.now(),
              };
              return {
                ...item,
                annotations: [...item.annotations, newAnnotation],
              };
            });
            return { ...room, items: updatedItem };
          });

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        });
      },

      addPhoto: (roomId, itemId, photoUrl) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.map((r) => {
            if (r.id !== roomId) return r;
            const updatedItem = r.items.map((i) => {
              if (i.id !== itemId) return i;
              const newPhoto: Photo = {
                id: uuidv4(),
                url: photoUrl,
                timestamp: Date.now(),
              };
              return { ...i, photos: [...i.photos, newPhoto] };
            });
            return { ...r, items: updatedItem };
          });

          const updatedInspection = {
            ...state.currentInspection,
            rooms: updatedRooms,
          };

          return {
            currentInspection: updatedInspection,
            inspections: state.inspections.map((i) =>
              i.id === updatedInspection.id ? updatedInspection : i
            ),
          };
        });
      },

      getInspectionStats: (inspection) => {
        const state = get();

        const target = inspection || state.currentInspection;

        if (!target) {
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

        const total = rooms.reduce((acc, room) => acc + room.items.length, 0);

        const pending = rooms.reduce(
          (acc, room) =>
            acc + room.items.filter((i) => i.status === "pending").length,
          0
        );
        const issues = rooms.reduce(
          (acc, room) =>
            acc + room.items.filter((i) => i.status === "issue").length,
          0
        );

        const ok = rooms.reduce(
          (acc, r) => acc + r.items.filter((i) => i.status === "ok").length,
          0
        );

        const completed = total - pending;

        const progress =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        return { total, pending, completed, ok, issues, progress };
      },
    }),
    {
      name: "inspection-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
