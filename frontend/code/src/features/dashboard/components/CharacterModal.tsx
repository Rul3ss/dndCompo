import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Swords,
  Save,
  Loader2,
  Image as ImageIcon,
  Upload,
  Info,
} from "lucide-react";
import {
  characterService,
  type Character,
} from "../../../lib/character.service";
import AvatarCropModal from "../../profile/components/AvatarCropModal";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  character?: Character | null; // Se fornecido, entra no modo de edição
}

const RACES = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Half-Orc",
  "Tiefling",
  "Dragonborn",
  "Gnome",
  "Aasimar",
  "Tabaxi",
  "Firbolg",
  "Genasi",
  "Goliath",
  "Kenku",
];
const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

export default function CharacterModal({
  isOpen,
  onClose,
  onSuccess,
  character,
}: CharacterModalProps) {
  const [name, setName] = useState("");
  const [system, setSystem] = useState("DND_5E");
  const [race, setRace] = useState("Human");
  const [charClass, setCharClass] = useState("Fighter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!character;

  useEffect(() => {
    if (character && isOpen) {
      setName(character.name);
      setSystem(character.system || "DND_5E");

      // Carregar raça e classe do sheetData se existirem
      const sheetData = character.sheetData || {};
      setRace(sheetData.race || "Human");
      setCharClass(sheetData.charClass || "Fighter");

      setPreviewUrl(character.imageUrl || null);
      setPendingFile(null);
    } else if (isOpen) {
      setName("");
      setSystem("DND_5E");
      setRace("Human");
      setCharClass("Fighter");
      setPreviewUrl(null);
      setPendingFile(null);
    }
  }, [character, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome da lenda é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      let charResult: Character;

      // Preparar sheetData com raça e classe
      const sheetData = {
        race,
        charClass,
      };

      if (isEdit && character) {
        // Em modo edição, mesclar com dados existentes
        const existingSheetData = character.sheetData || {};
        charResult = await characterService.updateCharacter(character.id, {
          name,
          system,
          sheetData: {
            ...existingSheetData,
            ...sheetData,
          },
        });
      } else {
        charResult = await characterService.createCharacter({
          name,
          system,
          sheetData,
        });
      }

      // Se houver um arquivo pendente, faz o upload agora que temos um ID
      if (pendingFile) {
        try {
          setUploadingImage(true);
          await characterService.uploadCharacterImage(
            charResult.id,
            pendingFile,
          );
        } catch (uploadErr) {
          console.error("Erro ao subir imagem após criação:", uploadErr);
          // O personagem foi criado, então não barramos o sucesso geral
        } finally {
          setUploadingImage(false);
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao gravar crônicas.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
    e.target.value = "";
  };

  const handleCropConfirm = async (croppedBlob: Blob) => {
    setCropSrc(null);
    const croppedFile = new File([croppedBlob], "portrait.jpg", {
      type: "image/jpeg",
    });

    // Se for edição, sobe direto
    if (isEdit && character) {
      try {
        setUploadingImage(true);
        setError("");
        await characterService.uploadCharacterImage(character.id, croppedFile);
        setPreviewUrl(URL.createObjectURL(croppedFile));
        onSuccess();
      } catch (err: any) {
        setError("Erro ao enviar imagem.");
      } finally {
        setUploadingImage(false);
      }
    } else {
      // Se for criação, guarda o arquivo e gera um preview local
      setPendingFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(croppedFile));
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-[#0c0a08]/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1510] border border-[#c9a84c]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center border border-[#c9a84c]/20">
                    {isEdit ? (
                      <Info className="w-4 h-4 text-[#c9a84c]" />
                    ) : (
                      <Swords className="w-4 h-4 text-[#c9a84c]" />
                    )}
                  </div>
                  <h2 className="font-cinzel text-lg font-bold text-[#e8d5b0] tracking-widest uppercase">
                    {isEdit ? "Editar Lenda" : "Nova Jornada"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#4a3820] hover:text-[#c9a84c] transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </motion.div>
                )}

                {/* Image Upload */}
                <div className="flex flex-col items-center gap-6 py-8 bg-white/5 rounded-2xl border border-dashed border-white/10 group hover:border-[#c9a84c]/30 transition-all">
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-[#c9a84c]/20 bg-[#0c0a08] shadow-2xl">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-[#c9a84c]/10" />
                      </div>
                    )}
                    {(uploadingImage || (loading && pendingFile)) && (
                      <div className="absolute inset-0 bg-[#0c0a08]/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage || loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-xl font-cinzel text-[10px] font-bold tracking-widest hover:bg-[#c9a84c]/20 transition-all shadow-lg disabled:opacity-50"
                  >
                    <Upload className="w-3 h-3" />
                    {previewUrl ? "TROCAR RETRATO" : "ADICIONAR RETRATO"}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-cinzel text-[#c9a84c]/60 uppercase tracking-widest font-bold ml-1 flex items-center gap-1">
                      Nome da Lenda
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Kaelen Estrela do Sul"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e8d5b0] focus:border-[#c9a84c]/40 focus:outline-none transition-all placeholder:text-white/10"
                      autoFocus
                    />
                  </div>

                  {/* Sistema */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-cinzel text-[#c9a84c]/60 uppercase tracking-widest font-bold ml-1">
                      Sistema de Reinos
                    </label>
                    <select
                      value={system}
                      onChange={(e) => setSystem(e.target.value)}
                      className="w-full bg-[#0c0a08] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e8d5b0] focus:border-[#c9a84c]/40 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option
                        value="DND_5E"
                        className="bg-[#0c0a08] text-[#e8d5b0]"
                      >
                        Dungeons & Dragons 5e
                      </option>
                      <option
                        value="PATHFINDER"
                        className="bg-[#0c0a08] text-[#e8d5b0]"
                      >
                        Pathfinder 2e
                      </option>
                      <option
                        value="OTHER"
                        className="bg-[#0c0a08] text-[#e8d5b0]"
                      >
                        Outro Sistema
                      </option>
                    </select>
                  </div>

                  {/* Raça e Classe */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Raça */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-cinzel text-[#c9a84c]/60 uppercase tracking-widest font-bold ml-1">
                        Raça
                      </label>
                      <select
                        value={race}
                        onChange={(e) => setRace(e.target.value)}
                        className="w-full bg-[#0c0a08] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e8d5b0] focus:border-[#c9a84c]/40 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        {RACES.map((r) => (
                          <option
                            key={r}
                            value={r}
                            className="bg-[#0c0a08] text-[#e8d5b0]"
                          >
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Classe */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-cinzel text-[#c9a84c]/60 uppercase tracking-widest font-bold ml-1">
                        Classe
                      </label>
                      <select
                        value={charClass}
                        onChange={(e) => setCharClass(e.target.value)}
                        className="w-full bg-[#0c0a08] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e8d5b0] focus:border-[#c9a84c]/40 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        {CLASSES.map((c) => (
                          <option
                            key={c}
                            value={c}
                            className="bg-[#0c0a08] text-[#e8d5b0]"
                          >
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-[#e8d5b0]/60 rounded-xl font-cinzel text-xs font-bold tracking-widest hover:bg-white/10 transition-all"
                    disabled={loading}
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#0c0a08] rounded-xl font-cinzel text-xs font-bold tracking-widest hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isEdit ? "SALVAR ALTERAÇÕES" : "CRIAR PERSONAGEM"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          <AnimatePresence>
            {cropSrc && (
              <AvatarCropModal
                imageSrc={cropSrc}
                onConfirm={handleCropConfirm}
                onCancel={handleCropCancel}
                cropShape="rect"
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
