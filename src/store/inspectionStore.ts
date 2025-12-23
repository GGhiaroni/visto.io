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

//minha store de vistorias
interface InspectionStore {
  //pode ser nula, caso não tenha nenhuma Vistoria aberta
  currentInspection: Inspection | null;
  createInspection: (address: string, clientName: string) => string;
  addRoom: (roomName: string) => void;
  addItemInspection: (roomId: string, itemName: string) => void;
  updateItemStatus: (
    roomId: string,
    itemId: string,
    newStatus: ItemStatus
  ) => void;
  addAnnotation: (roomId: string, itemId: string, text: string) => void;
  addPhoto: (roomId: string, itemId: string, photoUrl: string) => void;
}

export const useInspectionStore = create<InspectionStore>()(
  persist(
    (set) => ({
      currentInspection: null,

      //criando o objeto vistoria
      createInspection: (address, clientName) => {
        const id = uuidv4();
        const newInspection: Inspection = {
          id,
          clientName,
          propertyAddress: address,
          date: Date.now(),
          status: "draft", //começa como rascunho
          rooms: [], //começa sem cômodos
        };

        set({ currentInspection: newInspection });

        console.log("Nova vistoria criada na store:", newInspection);

        return id;
      },

      addRoom: (roomName) =>
        set((state) => {
          if (!state.currentInspection) return state;

          const newRoom: Room = {
            id: uuidv4(),
            name: roomName,
            isCompleted: false,
            items: [], // aqui, vou começar vazio
          };

          return {
            currentInspection: {
              ...state.currentInspection,
              rooms: [...state.currentInspection.rooms, newRoom],
            },
          };
        }),

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
              return {
                ...room,
                items: [...room.items, newInspectionItem],
              };
            }
            return room;
          });

          return {
            currentInspection: {
              ...state.currentInspection,
              rooms: updatedRooms,
            },
          };
        }),

      updateItemStatus: (roomId, itemId, newStatus) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRooms = state.currentInspection.rooms.map((room) => {
            if (room.id !== roomId) return room;

            const updatedItems = room.items.map((item) => {
              if (item.id !== itemId) return item;

              return {
                ...item,
                status: newStatus,
              };
            });

            return {
              ...room,
              items: updatedItems,
            };
          });

          return {
            currentInspection: {
              ...state.currentInspection,
              rooms: updatedRooms,
            },
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

            return {
              ...room,
              items: updatedItem,
            };
          });

          return {
            currentInspection: {
              ...state.currentInspection,
              rooms: updatedRooms,
            },
          };
        });
      },

      addPhoto: (roomId, itemId, photoUrl) => {
        set((state) => {
          if (!state.currentInspection) return state;

          const updatedRoom = state.currentInspection.rooms.map((r) => {
            if (r.id !== roomId) return r;

            const updatedItem = r.items.map((i) => {
              if (i.id !== itemId) return i;

              const newPhoto: Photo = {
                id: uuidv4(),
                url: photoUrl,
                timestamp: Date.now(),
              };

              return {
                ...i,
                photos: [...i.photos, newPhoto],
              };
            });

            return {
              ...r,
              items: updatedItem,
            };
          });

          return {
            currentInspection: {
              ...state.currentInspection,
              rooms: updatedRoom,
            },
          };
        });
      },
    }),
    {
      name: "inspection-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
