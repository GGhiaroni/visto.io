import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "../components/lib/utils";
import { Button } from "../components/ui/Button";
import { useInspectionStore } from "../store/inspectionStore";

const ItemInspectionDetails = () => {
  const { id, roomId, itemId } = useParams();
  const navigate = useNavigate();
  const { currentInspection, updateItemStatus, addAnnotation } =
    useInspectionStore();

  const [addAnnotationText, setAddAnnotationText] = useState("");

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

  const handleAddAnnotation = () => {
    if (!addAnnotationText.trim()) {
      return toast.warning("Escreva algum texto antes de salvar.");
    }

    if (roomId && itemId) {
      addAnnotation(roomId, itemId, addAnnotationText);
      setAddAnnotationText("");
      toast.success("Observação salva com sucesso!");
    }
  };

  return (
    <div className="space-y-6 pb-10">
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
                ? "bg-green-600 hover:bg-green-600 border-green-600"
                : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
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
                : "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
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
                ? "bg-amber-500 hover:bg-amber-500 border-amber-500"
                : "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
            )}
            onClick={() => handleItemStatus("pending")}
          >
            <CircleDashed className="h-6 w-6" />
            <span>Pendente</span>
          </Button>
        </div>
      </div>

      <hr className="border-slate-100" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Observações
        </h3>

        <div className="relative">
          <textarea
            className="w-full p-4 pr-16 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px]"
            placeholder="Descreva detalhes, avarias ou observações..."
            value={addAnnotationText}
            onChange={(e) => setAddAnnotationText(e.target.value)}
          ></textarea>

          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              onClick={handleAddAnnotation}
              disabled={!addAnnotationText.trim()}
              className="h-8 px-3 rounded-lg"
            >
              Salvar <Send className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {currentItem.annotations.length > 0 ? (
            currentItem.annotations.map((a) => (
              <div
                key={a.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <span className="text-slate-700 text-sm leading-relaxed">
                  {a.text}
                </span>
                <span className="text-[10px] text-slate-400 font-medium text-right uppercase tracking-wider">
                  {new Date(a.timestamp).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-300 gap-2 border-2 border-dashed border-slate-100 rounded-xl">
              <MessageSquare className="h-8 w-8 opacity-50" />
              <span className="text-xs">Nenhuma anotação ainda.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemInspectionDetails;
