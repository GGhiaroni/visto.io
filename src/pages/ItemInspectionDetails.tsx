import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useInspectionStore } from "../store/inspectionStore";

// /vistoria/: id / comodo /: roomId / item /: itemId

const ItemInspectionDetails = () => {
  const { id, roomId, itemId } = useParams();
  const navigate = useNavigate();
  const { currentInspection } = useInspectionStore();

  const currentRoom = currentInspection?.rooms.find(
    (room) => room.id === roomId
  );

  const currentItem = currentRoom?.items.find((item) => item.id === itemId);

  if (!currentInspection || !currentRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500">Cômodo não encontrado.</p>
        <Button onClick={() => navigate(`/vistoria/${id}`)}>Voltar</Button>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500">Item não encontrado.</p>
        <Button onClick={() => navigate(`/vistoria/${id}`)}>Voltar</Button>
      </div>
    );
  }

  return (
    <div>
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
          <p className="text-xs text-slate-500">Inspeção de itens</p>
        </div>
      </div>
    </div>
  );
};

export default ItemInspectionDetails;
