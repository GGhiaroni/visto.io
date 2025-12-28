import {
  ArrowLeft,
  CircleAlert,
  ClipboardClock,
  Plus,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useInspectionStore } from "../store/inspectionStore";

const RoomDetails = () => {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const { currentInspection, addItemInspection, deleteItemInspection } =
    useInspectionStore();

  const [newItemName, setNewItemName] = useState("");

  const handleAddItemInspection = () => {
    if (!newItemName.trim()) return;
    if (!roomId?.trim()) return;

    addItemInspection(roomId, newItemName);
    setNewItemName("");
    toast.success("Item adicionado com sucesso!");
  };

  const handleDeleteItemInspection = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (confirm("Tem certeza de que deseja excluir esse item?")) {
      if (roomId) {
        deleteItemInspection(roomId, itemId);
        toast.success("Item excluído com sucesso.");
      }
    }
  };

  const currentRoom = currentInspection?.rooms.find((r) => r.id === roomId);

  const itemInspectionStatus = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex gap-2 items-center">
            <ClipboardClock className="h-4 w-4 text-amber-500" />
          </span>
        );
      case "ok":
        return (
          <span className="inline-flex gap-2 items-center">
            <ThumbsUp className="h-4 w-4 text-primary" />
          </span>
        );
      case "issue":
        return (
          <span className="inline-flex gap-2 items-center">
            <CircleAlert className="h-4 w-4 text-red-600" />
          </span>
        );
      default:
        return null;
    }
  };

  if (!currentInspection || !currentRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500">Cômodo não encontrado.</p>
        <Button onClick={() => navigate(`/vistoria/${id}`)}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/vistoria/${id}`)}
          className="-ml-2"
        >
          <ArrowLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-forte">{currentRoom.name}</h1>
          <p className="text-xs text-slate-500">Inspeção de itens</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Adicionar item inspecionado"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddItemInspection}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-3">
        {currentRoom.items.length === 0 && (
          <p className="text-center text-slate-400 py-4 text-sm">
            Nenhum item adicionado neste cômodo.
          </p>
        )}

        {currentRoom.items.map((roomItem) => (
          <Card
            key={roomItem.id}
            className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer transform"
            onClick={() =>
              navigate(`/vistoria/${id}/comodo/${roomId}/item/${roomItem.id}`)
            }
          >
            <span className="font-medium text-slate-700">{roomItem.name}</span>

            <div className="flex items-center gap-3">
              <span>{itemInspectionStatus(roomItem.status)}</span>
              <button
                onClick={(e) => handleDeleteItemInspection(e, roomItem.id)}
                className="p-2 -mr-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Excluir item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
