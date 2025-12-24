import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  Home,
  PieChart,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../components/lib/utils";
import { InspectionReport } from "../components/pdf/InspectionReport";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useInspectionStore } from "../store/inspectionStore";

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentInspection, addRoom, getInspectionStats } =
    useInspectionStore();

  const [newRoomName, setNewRoomName] = useState("");

  if (!currentInspection) {
    return <p>Carregando...</p>;
  }

  const stats = getInspectionStats();

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    addRoom(newRoomName);
    setNewRoomName("");
  };

  return (
    <div className="space-y-6 pb-20">
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
          <p className="text-xs text-slate-500">id: {id?.slice(0, 8)}...</p>
        </div>
      </div>

      <Card className="p-4 space-y-4 bg-white border-slate-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Imóvel
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              {currentInspection.propertyAddress}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Cliente</p>
              <p className="text-sm font-medium text-slate-700">
                {currentInspection.clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Data</p>
              <p className="text-sm font-medium text-slate-700">
                {new Date(currentInspection.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Resumo
          </h3>
          <span className="text-xs font-bold text-primary">
            {stats.progress}% Concluído
          </span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-200 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-slate-700">
              {stats.total}
            </span>
            <span className="text-[10px] uppercase text-slate-500 font-bold">
              Total de Itens
            </span>
          </div>

          <div className="bg-green-200 p-3 rounded-xl border border-green-300 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-green-600">
              {stats.completed}
            </span>
            <span className="text-[10px] uppercase text-green-600 font-bold">
              OK
            </span>
          </div>

          <div
            className={cn(
              "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors",
              stats.issues > 0
                ? "bg-red-200 border-red-300"
                : "bg-slate-50 border-slate-100"
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold",
                stats.issues > 0 ? "text-red-600" : "text-slate-400"
              )}
            >
              {stats.issues}
            </span>
            <span
              className={cn(
                "text-[10px] uppercase font-bold",
                stats.issues > 0 ? "text-red-600" : "text-slate-400"
              )}
            >
              Alertas
            </span>
          </div>

          <div
            className={cn(
              "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors",
              stats.pending > 0
                ? "bg-amber-100 border-amber-300"
                : "bg-slate-50 border-slate-100"
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold",
                stats.pending > 0 ? "text-amber-500" : "text-slate-400"
              )}
            >
              {stats.issues}
            </span>
            <span
              className={cn(
                "text-[10px] uppercase font-bold",
                stats.issues > 0 ? "text-amber-500" : "text-slate-400"
              )}
            >
              Pendentes
            </span>
          </div>
        </div>

        <PDFDownloadLink
          document={<InspectionReport data={currentInspection} />}
          fileName={`vistoria-${currentInspection.clientName}-${currentInspection.id}.pdf`}
        >
          {({ loading }) => (
            <Button
              className="w-full gap-2 mt-2"
              disabled={loading || stats.total === 0}
              variant={stats.total > 0 ? "default" : "secondary"}
            >
              <FileText className="h-4 w-4" />
              {loading ? "Preparando PDF..." : "Baixar Relatório PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-forte">Cômodos</h2>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-bold">
            {currentInspection.rooms.length}
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ex: Cozinha, Banheiro..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <Button onClick={handleAddRoom} size="icon" className="shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-3">
          {currentInspection.rooms.map((room) => {
            const roomItemsCount = room.items.length;
            const roomIssues = room.items.filter(
              (i) => i.status === "issue"
            ).length;
            const roomCompleted = room.items.filter(
              (i) => i.status !== "pending"
            ).length;

            return (
              <Card
                key={room.id}
                className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer active:scale-95"
                onClick={() => navigate(`/vistoria/${id}/comodo/${room.id}`)}
              >
                <div className="flex items-center gap-3">
                  {roomItemsCount > 0 && roomItemsCount === roomCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                  )}
                  <div>
                    <span className="font-medium text-slate-700 block">
                      {room.name}
                    </span>

                    {roomIssues > 0 && (
                      <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {roomIssues} problema(s)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  {roomItemsCount} itens
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
