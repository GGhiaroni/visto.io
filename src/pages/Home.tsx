import { Building, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";

const Home = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-forte tracking-tight">
            Nova Vistoria
          </h2>
        </div>

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-slate-700">
              <Building className="h-4 w-4 text-primary" />
              Dados do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Ex: Ed. Aurora, Apt 302"
                className="h-12 text-base"
              />
            </div>

            <Button
              className="w-full h-12 text-base shadow-lg shadow-primary/20"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Iniciar Inspeção
            </Button>
          </CardContent>
        </Card>
      </section>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar vistoria antiga..."
          className="pl-10 bg-white border-slate-200"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-forte tracking-tight">
          Recentes
        </h2>

        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
          <div className="bg-slate-100 p-4 rounded-full mb-3">
            <Building className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-medium mb-1">
            Nenhuma vistoria ainda
          </h3>
          <p className="text-sm text-slate-500 max-w-[250px]">
            Suas vistorias realizadas aparecerão aqui para consulta e
            exportação.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
