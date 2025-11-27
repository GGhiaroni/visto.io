import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useInspectionStore } from "../store/inspectionStore";

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentInspection, addRoom } = useInspectionStore();

  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    if (!currentInspection || currentInspection.id !== id) {
      toast.error("Vistoria não encontrada ou expirada.");
      navigate("/");
    }
  }, [currentInspection, id, navigate]);

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;

    addRoom(newRoomName);
    setNewRoomName("");
    toast.success("Cômodo adicionado com sucesso!");
  };

  if (!currentInspection) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="-ml-2"
        >
          <ArrowLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-forte">Detalhes da Vistoria</h1>
          <p className="text-xs text-slate-500 font-mono">
            id: {id?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg mt-1">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Imóvel
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentInspection?.propertyAddress}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="text-xs text-slate-500">Cliente</p>
              <p className="font-medium text-slate-700">
                {currentInspection?.clientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="text-xs text-slate-500">Data</p>
              <p className="font-medium text-slate-700">
                {new Date(currentInspection.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-accent flex items-center justify-between">
          Cômodos
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {currentInspection.rooms.length}
          </span>
        </h2>

        <div className="flex gap-2">
          <Input
            placeholder="Ex: Cozinha, Banheiro..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddRoom}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-3">
          {currentInspection.rooms.length === 0 && (
            <p className="text-center text-slate-400 py-4 text-sm">
              Nenhum cômodo adicionado até o momento.
            </p>
          )}

          {currentInspection.rooms.map((room) => (
            <Card
              key={room.id}
              className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer active:scale-95 transform"
            >
              <div className="flex items-center gap-3">
                {room.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
                <span className="font-medium text-slate-700">{room.name}</span>
              </div>

              <div className="text-xs text-slate-400">
                {room.items.length === 1
                  ? "1 item"
                  : `${room.items.length} itens`}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
