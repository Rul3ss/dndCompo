import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Edit, User } from 'lucide-react';
import type { Character } from '../../../lib/character.service';

interface CharacterCardProps {
  character: Character;
  onOpenSheet: () => void;
  onEditProfile: () => void;
  onDelete: () => void;
}

export default function CharacterCard({ character, onOpenSheet, onEditProfile, onDelete }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#1a1510] border border-[#c9a84c]/20 rounded-2xl overflow-hidden hover:border-[#c9a84c]/50 transition-all shadow-xl"
    >
      {/* Sistema Badge */}
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#0c0a08]/80 border border-[#c9a84c]/30 rounded-lg backdrop-blur-md">
        <span className="text-[10px] font-cinzel font-bold text-[#c9a84c] tracking-widest uppercase">
          {character.system?.replace('_', ' ') || 'DND 5E'}
        </span>
      </div>

      {/* Imagem/Avatar */}
      <div className="relative h-48 overflow-hidden bg-[#0c0a08] flex items-center justify-center border-b border-white/5">
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="relative flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <User className="w-16 h-16 text-[#c9a84c]" />
            <span className="font-cinzel text-[10px] tracking-[0.2em]">SEM RETRATO</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] to-transparent opacity-60" />
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="font-cinzel text-lg font-bold text-[#e8d5b0] mb-6 tracking-wide truncate group-hover:text-[#c9a84c] transition-colors">
          {character.name}
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSheet}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c9a84c]/5 border border-[#c9a84c]/20 text-[#c9a84c] rounded-xl font-cinzel text-[10px] font-bold tracking-widest hover:bg-[#c9a84c] hover:text-[#0c0a08] transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            ABRIR FICHA
          </button>
          
          <button
            onClick={onEditProfile}
            className="p-2.5 bg-white/5 border border-white/10 text-[#e8d5b0]/60 rounded-xl hover:text-[#c9a84c] hover:bg-white/10 transition-all"
            title="Editar Perfil"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={onDelete}
            className="p-2.5 bg-red-900/5 border border-red-500/10 text-red-500/40 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-all"
            title="Deletar Lenda"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
