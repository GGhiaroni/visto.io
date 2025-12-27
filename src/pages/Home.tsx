import { ClipboardList, Eye, History, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/authStore";
import { useInspectionStore } from "../store/inspectionStore";

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { inspections, setCurrentInspection, getInspectionStats } =
    useInspectionStore();

  const userName = user?.user_metadata.name || user?.email?.split("@")[0];

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasInspection = inspections.length > 0;
  const [highlightedInspection, ...otherInspections] = inspections;

  const highlightedStats = getInspectionStats(highlightedInspection);
  const isHighlightedCompleted =
    highlightedStats.progress === 100 && highlightedStats.total > 0;

  const handleOpen = (id: string) => {
    setCurrentInspection(id);
    navigate(`/vistoria/${id}`);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Olá, {userName} 👋</h1>
          <p className="text-slate-500">{today}</p>
        </div>
        <Button onClick={() => navigate("/nova-vistoria")} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova vistoria
        </Button>
      </div>

      {hasInspection ? (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Última vistoria visualizada
            </h2>

            <Card
              className={cn(
                "p-6 border-l-4 cursor-pointer hover:shadow-lg transition-all bg-white group",
                isHighlightedCompleted
                  ? "border-l-green-500"
                  : "border-l-primary"
              )}
              onClick={() => handleOpen(highlightedInspection.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-slate-800 group-hover:text-primary transition-colors">
                    {highlightedInspection.propertyAddress}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Cliente: {highlightedInspection.clientName}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors",
                    isHighlightedCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  )}
                >
                  {isHighlightedCompleted ? "Finalizado" : "Em andamento"}
                </span>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Progresso</span>
                  <span>{highlightedStats.progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000",
                      isHighlightedCompleted ? "bg-green-500" : "bg-primary"
                    )}
                    style={{ width: `${highlightedStats.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          </section>

          {otherInspections.length > 0 && (
            <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History className="h-4 w-4" />
                Vistos recentemente
              </h2>

              <div className="grid gap-3">
                {otherInspections.map((inspection) => {
                  const stats = getInspectionStats(inspection);
                  const isDone = stats.progress === 100 && stats.total > 0;

                  return (
                    <Card
                      key={inspection.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors border-slate-100 group"
                      onClick={() => handleOpen(inspection.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all flex items-center justify-center text-slate-400 group-hover:text-primary">
                          <Eye className="h-5 w-5" />
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-700 text-sm group-hover:text-primary transition-colors">
                            {inspection.propertyAddress}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Visto em:{" "}
                            <span className="text-slate-500 font-medium">
                              {new Date(inspection.date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-1 rounded",
                            isDone
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {stats.progress}%
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Nenhuma vistoria encontrada
          </h3>
          <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs mx-auto">
            Seu histórico está vazio. Comece sua primeira inspeção profissional
            agora.
          </p>
          <Button onClick={() => navigate("/nova-vistoria")}>
            Começar Nova Vistoria
          </Button>
        </Card>
      )}

      <section className="pt-4 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
          <History className="h-3 w-3" />
          <span>Resumo Geral</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <span className="text-2xl font-bold text-slate-800">
              {inspections.length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mt-1">
              Total Criadas
            </span>
          </Card>
          <Card className="p-4">
            <span className="text-2xl font-bold text-green-600">
              {
                inspections.filter(
                  (i) =>
                    getInspectionStats(i).progress === 100 && i.rooms.length > 0
                ).length
              }
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mt-1">
              Finalizadas
            </span>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
