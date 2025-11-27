import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import type { Inspection, Room } from "../types/inspection";

//minha store de vistorias
interface InspectionStore {
  //pode ser nula, caso não tenha nenhuma Vistoria aberta
  currentInspection: Inspection | null;
  createInspection: (address: string, clientName: string) => string;
  addRoom: (roomName: string) => void;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
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
}));
