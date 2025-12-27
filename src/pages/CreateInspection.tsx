import { Building, Loader2, MapPin, Plus, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { fetchAddressByCep } from "../services/viaCepService";
import { useInspectionStore } from "../store/inspectionStore";

const CreateInspection = () => {
  const [clientName, setClientName] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  const navigate = useNavigate();

  const { createInspection } = useInspectionStore();

  const handleStartInspection = () => {
    if (!clientName || !street || !number || !city) {
      toast.error(
        "Por favor, preencha os dados obrigatórios (Cliente, Rua e Número)."
      );
      return;
    }

    const fullAddress = `${street}, ${number} ${
      complement ? `- ${complement}` : ""
    } - ${neighborhood} - ${city}/${uf}`;

    const idCriado = createInspection(fullAddress, clientName);

    setClientName("");
    setCep("");
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");

    toast.success("Vistoria iniciada com sucesso! Verifique o console!");

    navigate(`/vistoria/${idCriado}`);
  };

  const handleBlurCep = async () => {
    if (cep.length < 8) return;

    setIsLoadingCep(true);

    try {
      const addressData = await fetchAddressByCep(cep);

      if (!addressData) {
        toast.error("CEP não encontrado!");
        setCep("");
        setStreet("");
        setNeighborhood("");
        setCity("");
        setUf("");
        return;
      }

      setStreet(addressData.logradouro);
      setNeighborhood(addressData.bairro);
      setCity(addressData.localidade);
      setUf(addressData.uf);

      document.getElementById("numero-input")?.focus();
      toast.success("Endereço preenchido!");
    } catch (error) {
      toast.error("Erro ao buscar CEP. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoadingCep(false);
    }
  };

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
              Dados Iniciais
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">
                Cliente
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Nome do cliente ou inquilino"
                  className="pl-10 h-12 text-base"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">
                CEP
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="00000-000"
                  className="pl-10 h-12 text-base"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleBlurCep}
                  maxLength={9}
                />

                {isLoadingCep && (
                  <div className="absolute right-3 top-3.5">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">
                Logradouro
              </label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rua, Av..."
                className="bg-slate-100 text-slate-500"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">
                Número
              </label>
              <Input
                id="numero-input"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Nº"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">
                Complemento
              </label>
              <Input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto 101, Bloco B..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">
                  Bairro
                </label>
                <Input
                  value={neighborhood}
                  readOnly
                  className="bg-slate-100 text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">
                  Cidade/UF
                </label>
                <Input
                  value={city && uf ? `${city}/${uf}` : ``}
                  readOnly
                  className="bg-slate-100 text-slate-500"
                />
              </div>
            </div>
            <Button
              className="w-full h-12 text-base shadow-lg shadow-primary/20 mt-4"
              size="lg"
              onClick={handleStartInspection}
            >
              <Plus className="mr-2 h-5 w-5" />
              Iniciar Inspeção
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CreateInspection;
