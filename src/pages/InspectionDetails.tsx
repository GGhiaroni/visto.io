import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleDashed,
  FileText,
  Home,
  PieChart,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InspectionReport } from "../components/pdf/InspectionReport";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { useInspectionStore } from "../store/inspectionStore";

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentInspection,
    addRoom,
    getInspectionStats,
    deleteRoom,
    syncInspections,
    setCurrentInspection,
  } = useInspectionStore();

  useEffect(() => {
    const loadData = async () => {
      if (!currentInspection || currentInspection.id !== id) {
        await syncInspections();
        if (id) {
          setCurrentInspection(id);
        }
      }
    };

    loadData();
  }, [id]);

  const [newRoomName, setNewRoomName] = useState("");

  if (!currentInspection) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500 animate-pulse">Carregando vistoria...</p>
      </div>
    );
  }

  const stats = getInspectionStats();

  const hasEmptyRooms = currentInspection.rooms.some(
    (r) => r.items.length === 0
  );

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    addRoom(newRoomName);
    setNewRoomName("");
  };

  const handleDeleteRoom = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (
      confirm(
        "Tem certeza que deseja excluir este cômodo e todos os seus itens?"
      )
    ) {
      deleteRoom(roomId);
    }
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
            Progresso Geral
          </h3>
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              stats.progress === 100
                ? "bg-green-100 text-green-700"
                : "bg-primary/10 text-primary"
            )}
          >
            {stats.progress}% Concluído
          </span>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100 shadow-inner">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              stats.progress === 100 ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {hasEmptyRooms && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight font-medium">
              Atenção: Existem cômodos sem itens registrados. O progresso só
              chegará a 100% após incluir ao menos um item em cada cômodo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-slate-700">
              {stats.total}
            </span>
            <span className="text-[9px] uppercase text-slate-500 font-bold text-center leading-none">
              Itens
              <br />
              Totais
            </span>
          </div>

          <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-green-600">
              {stats.ok}
            </span>
            <span className="text-[9px] uppercase text-green-600 font-bold text-center leading-none">
              Status
              <br />
              OK
            </span>
          </div>

          <div
            className={cn(
              "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors",
              stats.issues > 0
                ? "bg-red-50 border-red-200"
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
                "text-[9px] uppercase font-bold text-center leading-none",
                stats.issues > 0 ? "text-red-600" : "text-slate-400"
              )}
            >
              Com
              <br />
              Problema
            </span>
          </div>

          <div
            className={cn(
              "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors",
              stats.pending > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-slate-50 border-slate-100"
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold",
                stats.pending > 0 ? "text-amber-500" : "text-slate-400"
              )}
            >
              {stats.pending}
            </span>
            <span
              className={cn(
                "text-[9px] uppercase font-bold text-center leading-none",
                stats.pending > 0 ? "text-amber-500" : "text-slate-400"
              )}
            >
              Status
              <br />
              Pendente
            </span>
          </div>
        </div>

        <PDFDownloadLink
          document={<InspectionReport data={currentInspection} />}
          fileName={`vistoria-${currentInspection.clientName}-${currentInspection.id}.pdf`}
        >
          {({ loading }) => (
            <Button
              className="w-full gap-2 mt-2 h-12"
              disabled={loading || stats.progress < 100}
              variant={stats.progress === 100 ? "default" : "outline"}
            >
              <FileText className="h-4 w-4" />
              {loading
                ? "Processando..."
                : stats.progress < 100
                ? "Conclua a vistoria para baixar o PDF"
                : "Baixar Relatório Final"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-forte">
            Ambientes Inspecionados
          </h2>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-bold">
            {currentInspection.rooms.length}
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ex: Cozinha, Banheiro..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="h-11"
          />
          <Button
            onClick={handleAddRoom}
            size="icon"
            className="shrink-0 h-11 w-11 shadow-md shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-3">
          {currentInspection.rooms.map((room) => {
            const roomItemsCount = room.items.length;
            const roomIssues = room.items.filter(
              (i) => i.status === "issue"
            ).length;
            const roomPending = room.items.filter(
              (i) => i.status === "pending"
            ).length;
            const roomCompleted = room.items.filter(
              (i) => i.status !== "pending"
            ).length;

            const isEmpty = roomItemsCount === 0;
            const isAllOk =
              roomItemsCount > 0 &&
              roomItemsCount === roomCompleted &&
              roomIssues === 0;

            return (
              <Card
                key={room.id}
                className={cn(
                  "p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border-l-4",
                  isEmpty
                    ? "border-l-slate-300 bg-slate-50/50"
                    : roomIssues > 0
                    ? "border-l-red-500 bg-red-50/30"
                    : roomPending > 0
                    ? "border-l-amber-500 bg-amber-50/30"
                    : "border-l-green-500 bg-green-50/30"
                )}
                onClick={() => navigate(`/vistoria/${id}/comodo/${room.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isEmpty ? (
                      <CircleDashed className="h-6 w-6 text-slate-300" />
                    ) : roomIssues > 0 ? (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    ) : isAllOk ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <CircleDashed className="h-6 w-6 text-amber-500" />
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block">
                      {room.name}
                    </span>

                    <div className="flex items-center gap-2 mt-0.5">
                      {isEmpty ? (
                        <span className="text-[10px] text-slate-400 italic">
                          Pendente de vistoria (vazio)
                        </span>
                      ) : (
                        <>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {roomItemsCount}{" "}
                            {roomItemsCount > 1 ? "itens" : "item"}
                          </span>
                          {roomIssues > 0 && (
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                              • {roomIssues} problema(s)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDeleteRoom(e, room.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
