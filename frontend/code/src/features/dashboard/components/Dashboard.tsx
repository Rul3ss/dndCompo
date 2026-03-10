import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Plus, ScrollText, BookOpen, Loader2 } from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import CharacterCard from "./CharacterCard";
import CharacterModal from "./CharacterModal";
import CharacterSheetModal from "./sheets/CharacterSheetModal";
import {
  characterService,
  type Character,
} from "../../../lib/character.service";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";

interface DashboardProps {
  onLogout?: () => Promise<void>;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null,
  );
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"characters" | "campaigns">(
    "characters",
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await characterService.getAllCharacters();
      setCharacters(data);
    } catch (e) {
      console.error("Error fetching characters:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = (char: Character) => {
    setEditingCharacter(char);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCharacter(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCharacterToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;
    
    try {
      setIsDeleting(true);
      await characterService.deleteCharacter(characterToDelete);
      setCharacters((prev) => prev.filter((c) => c.id !== characterToDelete));
      setIsConfirmDeleteOpen(false);
      setCharacterToDelete(null);
    } catch (e) {
      alert("Erro ao deletar personagem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenSheet = (character: Character) => {
    setSelectedCharacter(character);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#e8d5b0] font-inter">
      <Navbar
        onSignInSelect={() => navigate("/login")}
        onCreateAccountSelect={() => navigate("/register")}
        onLogout={onLogout}
      />

      <main className="pt-[120px] pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[#c9a84c]/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-2"
              >
                <div className="w-8 h-px bg-[#c9a84c]/30" />
                Painel do Aventureiro
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-cinzel text-4xl md:text-5xl font-bold text-[#e8d5b0] tracking-tight"
              >
                Suas Crônicas
              </motion.h1>
            </div>

            <div className="flex bg-[#1a1510]/60 backdrop-blur-md rounded-2xl p-1.5 border border-[#c9a84c]/10 shadow-lg self-start">
              <button
                onClick={() => setActiveTab("characters")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-widest transition-all ${
                  activeTab === "characters"
                    ? "bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] shadow-lg shadow-[#c9a84c]/20"
                    : "text-[#a89070] hover:text-[#e8d5b0]"
                }`}
              >
                <ScrollText className="w-4 h-4" />
                PERSONAGENS
              </button>
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-widest transition-all ${
                  activeTab === "campaigns"
                    ? "bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] shadow-lg shadow-[#c9a84c]/20"
                    : "text-[#a89070] hover:text-[#e8d5b0]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                CAMPANHAS
              </button>
            </div>
          </div>

          <div className="relative">
            {activeTab === "characters" ? (
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-32"
                  >
                    <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin mb-4" />
                    <p className="font-cinzel text-[#a89070] tracking-widest">
                      INVOCANDO LENDAS...
                    </p>
                  </motion.div>
                ) : characters.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-32 bg-[#1a1510]/20 rounded-3xl border border-[#c9a84c]/10 border-dashed"
                  >
                    <div className="w-20 h-20 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mb-6">
                      <Plus className="w-10 h-10 text-[#c9a84c]/40" />
                    </div>
                    <h2 className="font-cinzel text-xl font-bold text-[#e8d5b0] mb-2">
                      O REINO ESTÁ VAZIO
                    </h2>
                    <p className="text-[#a89070] text-sm mb-8 text-center max-w-sm">
                      Parece que você ainda não forjou nenhum herói. Comece sua
                      jornada agora mesmo.
                    </p>
                    <button
                      onClick={handleCreateNew}
                      className="py-3 px-8 bg-gradient-to-r from-[#c9a84c] to-[#a07830] rounded-xl text-[#0c0a08] font-cinzel text-xs font-bold tracking-widest shadow-xl hover:shadow-[#c9a84c]/10 transition-all active:scale-95"
                    >
                      FORJAR NOVO HERÓI
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    <motion.button
                      whileHover={{ y: -5 }}
                      onClick={handleCreateNew}
                      className="group aspect-[3/4] sm:aspect-auto flex flex-col items-center justify-center gap-4 bg-[#1a1510]/20 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl hover:border-[#c9a84c]/50 transition-all duration-300 min-h-[300px]"
                    >
                      <div className="w-12 h-12 bg-[#c9a84c]/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-[#c9a84c]" />
                      </div>
                      <span className="font-cinzel text-xs font-bold text-[#c9a84c]/60 group-hover:text-[#c9a84c] tracking-widest">
                        NOVA FICHA
                      </span>
                    </motion.button>

                    {characters.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        onOpenSheet={() => handleOpenSheet(char)}
                        onEditProfile={() => handleEditProfile(char)}
                        onDelete={() => handleDeleteClick(char.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 bg-[#1a1510]/20 rounded-3xl border border-[#c9a84c]/10"
              >
                <div className="w-16 h-16 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mb-6">
                  <Swords className="w-8 h-8 text-[#c9a84c]/40" />
                </div>
                <h2 className="font-cinzel text-xl font-bold text-[#e8d5b0] mb-2">
                  CAMPANHAS EM BREVE
                </h2>
                <p className="text-[#a89070] text-sm text-center max-w-sm">
                  Estamos preparando os mapas e as masmorras para suas próximas
                  grandes aventuras.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <CharacterModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCharacters}
        character={editingCharacter}
      />

      <CharacterSheetModal
        character={selectedCharacter}
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onUpdate={fetchCharacters}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        title="Apagar Lenda"
        message="Deseja realmente apagar esta lenda das crônicas? Esta ação é permanente e não poderá ser desfeita."
        confirmLabel={isDeleting ? "Apagando..." : "Apagar Lenda"}
        cancelLabel="Manter Lenda"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        variant="danger"
      />
    </div>
  );
}
