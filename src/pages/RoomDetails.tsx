import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useInspectionStore } from "../store/inspectionStore";

const RoomDetails = () => {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const { currentInspection, addItemInspection } = useInspectionStore();

  const [newItemName, setNewItemName] = useState("");

  const handleAddItemInspection = () => {
    if (!newItemName.trim()) return;
    if (!roomId?.trim()) return;

    addItemInspection(roomId, newItemName);
    setNewItemName("");
    toast.success("Item adicionado com sucesso!");
  };

  const currentRoom = currentInspection?.rooms.find((r) => r.id === roomId);

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
    </div>
  );
};

export default RoomDetails;
