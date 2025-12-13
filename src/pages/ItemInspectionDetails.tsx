import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../components/lib/utils";
import { Button } from "../components/ui/Button";
import { useInspectionStore } from "../store/inspectionStore";

const ItemInspectionDetails = () => {
  const { id, roomId, itemId } = useParams();
  const navigate = useNavigate();
  const { currentInspection, updateItemStatus } = useInspectionStore();

  const currentRoom = currentInspection?.rooms.find(
    (room) => room.id === roomId
  );

  const currentItem = currentRoom?.items.find((item) => item.id === itemId);

  if (!currentInspection || !currentRoom || !currentItem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500">Item não encontrado.</p>
        <Button onClick={() => navigate(`/vistoria/${id}`)}>Voltar</Button>
      </div>
    );
  }

  const handleItemStatus = (status: "pending" | "issue" | "ok") => {
    if (roomId && itemId) {
      updateItemStatus(roomId, itemId, status);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/vistoria/${id}/comodo/${roomId}`)}
          className="-ml-2"
        >
          <ArrowLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-forte">{currentItem.name}</h1>
          <p className="text-xs text-slate-500">Local: {currentRoom.name}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Situação do Item
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={currentItem.status === "ok" ? "default" : "outline"}
            className={cn(
              "flex flex-col gap-1 h-20",
              currentItem.status === "ok"
                ? "bg-green-600 hover:bg-green-600"
                : "hover:bg-green-600 hover:text-white"
            )}
            onClick={() => handleItemStatus("ok")}
          >
            <CheckCircle2 className="h-6 w-6" />
            <span>Conforme</span>
          </Button>

          <Button
            variant={currentItem.status === "issue" ? "default" : "outline"}
            className={cn(
              "flex flex-col gap-1 h-20",
              currentItem.status === "issue"
                ? "bg-red-600 hover:bg-red-600 border-red-600"
                : "hover:bg-red-600 hover:text-white"
            )}
            onClick={() => handleItemStatus("issue")}
          >
            <AlertCircle className="h-6 w-6" />
            <span>Problema</span>
          </Button>

          <Button
            variant={currentItem.status === "pending" ? "default" : "outline"}
            className={cn(
              "flex flex-col gap-1 h-20",
              currentItem.status === "pending"
                ? "bg-amber-500 hover:bg-amber-500"
                : "hover:bg-amber-500"
            )}
            onClick={() => handleItemStatus("pending")}
          >
            <CircleDashed className="h-6 w-6" />
            <span>Pendente</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemInspectionDetails;
