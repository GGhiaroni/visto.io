import { ClipboardList, History, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/authStore";
import { useInspectionStore } from "../store/inspectionStore";

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { currentInspection, getInspectionStats } = useInspectionStore();

  const userName = user?.user_metadata.name || user?.email?.split("@")[0];

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = getInspectionStats();

  const isCompleted = stats.progress === 100 && stats.total > 0;

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

      {currentInspection ? (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Última vistoria visualizada
          </h2>

          <Card
            className={cn(
              "p-6 border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-all",
              isCompleted ? "border-l-primary" : "border-l-slate-400"
            )}
            onClick={() => navigate(`/vistoria/${currentInspection.id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {currentInspection.propertyAddress}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Cliente: {currentInspection.clientName}
                </p>
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors",
                  isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                {isCompleted ? "Finalizado" : "Em andamento"}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Progresso</span>
                <span>{stats.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </Card>
        </section>
      ) : (
        <Card className="p-8 text-center border-dashed border-2 bg-slate-50/50">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardList className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-medium">
            Nenhuma vistoria em aberto
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Comece uma nova inspeção agora mesmo.
          </p>
          <Button variant="outline" onClick={() => navigate("/nova-vistoria")}>
            Iniciar Inspeção
          </Button>
        </Card>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          Resumo do Mês
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-2xl font-bold text-slate-800">0</span>
            <span className="text-xs text-slate-500 uppercase">Realizadas</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-2xl font-bold text-slate-800">0</span>
            <span className="text-xs text-slate-500 uppercase">
              Sincronizadas
            </span>
          </Card>
        </div>
        <p className="text-xs text-slate-400 italic">
          * Conectaremos o histórico completo ao banco de dados em breve.
        </p>
      </section>
    </div>
  );
};

export default Home;
