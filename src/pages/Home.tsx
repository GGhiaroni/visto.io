import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
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
    </div>
  );
};

export default Home;
