import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useInspectionStore } from "../store/inspectionStore";

const RoomDetails = () => {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const { currentInspection } = useInspectionStore();

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

      <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p>Aqui vamos listar: Paredes, Pisos, Janelas...</p>
      </div>
    </div>
  );
};

export default RoomDetails;
