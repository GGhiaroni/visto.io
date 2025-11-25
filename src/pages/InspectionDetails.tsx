import { ArrowLeft, Building, Calendar, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { useInspectionStore } from "../store/inspectionStore";

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentInspection } = useInspectionStore();

  useEffect(() => {
    if (!currentInspection || currentInspection.id !== id) {
      toast.error("Vistoria não encontrada ou expirada.");
      navigate("/");
    }
  }, [currentInspection, id, navigate]);

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

      <div className="text-center py-10 text-slate-400">
        <p>Aqui entrará a lista de cômodos...</p>
      </div>
    </div>
  );
};

export default InspectionDetails;
