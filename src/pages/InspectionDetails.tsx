import { ArrowLeft, Building, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
            ID: {id?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Carregando dados...</h3>
            <p className="text-sm text-slate-500">Endereço do imóvel</p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="text-center py-10 text-slate-400">
        <p>Aqui entrará a lista de cômodos...</p>
      </div>
    </div>
  );
};

export default InspectionDetails;
