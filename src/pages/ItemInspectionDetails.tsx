import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  CircleDashed,
  ImageIcon,
  MessageSquare,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";
import { useInspectionStore } from "../store/inspectionStore";

import type { Photo } from "../types/inspection";

const ItemInspectionDetails = () => {
  const { id, roomId, itemId } = useParams();
  const navigate = useNavigate();
  const {
    currentInspection,
    updateItemStatus,
    addAnnotation,
    addPhoto,
    deleteItemInspection,
    deletePhoto,
    syncInspections,
    setCurrentInspection,
  } = useInspectionStore();

  const [addAnnotationText, setAddAnnotationText] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!currentInspection || currentInspection.id !== id) {
        await syncInspections();
        if (id) setCurrentInspection(id);
      }
    };
    loadData();
  }, [id, syncInspections, setCurrentInspection]);

  const currentRoom = currentInspection?.rooms.find(
    (room) => room.id === roomId
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleTriggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && roomId && itemId && id) {
      const toastId = toast.loading("Enviando foto para a nuvem...");

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${id}/${roomId}/${itemId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("visto.io - photos")
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("visto.io - photos").getPublicUrl(fileName);

        await addPhoto(roomId, itemId, publicUrl);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.dismiss(toastId);
        toast.success("Foto adicionada!");
      } catch (error) {
        toast.dismiss(toastId);
        console.error("Erro no upload:", error);
        toast.error("Erro ao processar a imagem. Tente novamente mais tarde.");
      }
    }
  };

  const handleDeleteItemInspection = () => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      if (roomId && itemId) {
        deleteItemInspection(roomId, itemId);
        navigate(`/vistoria/${id}/comodo/${roomId}`);
        toast.success("Item excluído com sucesso.");
      }
    }
  };

  const handleDeletePhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();

    if (confirm("Excluir esta foto permanentemente?")) {
      if (roomId && itemId) {
        deletePhoto(roomId, itemId, photoId);
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(null);
        }
        toast.success("Foto excluída com sucesso.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
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

        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleDeleteItemInspection}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
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
      <hr className="border-slate-100" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Evidências Fotográficas
          </h3>
          <span className="text-xs text-slate-400">
            {currentItem.photos.length} fotos
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full h-16 border-dashed border-2 border-slate-200 hover:border-primary/50 hover:bg-slate-50 text-slate-500 gap-2"
          onClick={handleTriggerCamera}
        >
          <Camera className="h-5 w-5" />
          Adicionar Foto
        </Button>

        {currentItem.photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {currentItem.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group aspect-square cursor-zoom-in"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt="Evidência"
                  className="w-full h-full object-cover rounded-xl border border-slate-100 shadow-sm"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-xl pointer-events-none">
                  <p className="text-[10px] text-white/90 text-right">
                    {new Date(photo.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeletePhoto(e, photo.id)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-600 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
                  title="Excluir foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-300">
            <ImageIcon className="h-8 w-8 opacity-30" />
            <span className="text-xs">Nenhuma foto registrada</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelect}
      />

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-50"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={selectedPhoto.url}
            alt="Tela cheia"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-medium">Registrada em</p>
              <p className="text-xs opacity-70">
                {new Date(selectedPhoto.timestamp).toLocaleString("pt-BR")}
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="gap-2 bg-red-600/80 hover:bg-red-600 border-none"
              onClick={(e) => handleDeletePhoto(e, selectedPhoto.id)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir Foto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemInspectionDetails;
