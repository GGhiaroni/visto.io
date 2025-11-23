export type ItemStatus = "pending" | "ok" | "issue" | "na";

export interface Annotation {
  id: string;
  text: string;
  timestamp: number;
}

export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  comment?: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  status: ItemStatus;
  annotations: Annotation[];
  photos: Photo[];
}

export interface Room {
  id: string;
  name: string;
  items: InspectionItem[];
  isCompleted: boolean;
}

export interface Inspection {
  id: string;
  clientName: string;
  propertyAddress: string;
  date: number;
  status: "draft" | "completed" | "synced";
  rooms: Room[];
}
