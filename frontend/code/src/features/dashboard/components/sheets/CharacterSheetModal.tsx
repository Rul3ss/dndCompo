import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Save, Edit2, Loader2 } from 'lucide-react';
import { characterService, type Character } from '../../../../lib/character.service';

// Sub-Sheets
import Dnd5eStatsPage from './dnd5e/Dnd5eStatsPage';
import Dnd5eSpellsPage from './dnd5e/Dnd5eSpellsPage';
import GenericSheet from './generic/GenericSheet';
import PathfinderSheet from './pathfinder/PathfinderSheet';
import OtherSheet from './other/OtherSheet';

// Constants
import { DND_5E_DEFAULT_DATA } from './dnd5e/constants';
import { GENERIC_DEFAULT_DATA } from './generic/constants';

interface CharacterSheetModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updated: Character) => void;
}

export default function CharacterSheetModal({ character, isOpen, onClose, onUpdate }: CharacterSheetModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localData, setLocalData] = useState<any>(null);
  const [activePage, setActivePage] = useState<'stats' | 'spells'>('stats');

  useEffect(() => {
    if (character && isOpen) {
      const isDnd = character.system === 'DND_5E';
      const defaultData = isDnd ? DND_5E_DEFAULT_DATA : GENERIC_DEFAULT_DATA;
      setLocalData(character.sheetData || defaultData);
    }
  }, [character, isOpen]);

  if (!character || !localData) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await characterService.updateCharacter(character.id, {
        sheetData: localData
      });
      if (onUpdate) onUpdate(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Erro ao gravar as mudanças nas crônicas.');
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (path: string, value: any) => {
    const newData = { ...localData };
    const parts = path.split('.');
    let current = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setLocalData(newData);
  };

  const renderSheetContent = () => {
    switch (character.system) {
      case 'DND_5E':
        return activePage === 'stats' ? (
          <Dnd5eStatsPage 
            character={character} 
            localData={localData} 
            isEditing={isEditing} 
            updateNested={updateNested} 
          />
        ) : (
          <Dnd5eSpellsPage 
            localData={localData} 
            isEditing={isEditing} 
            updateNested={updateNested} 
          />
        );
      case 'PATHFINDER':
        return <PathfinderSheet 
          character={character} 
          localData={localData} 
          isEditing={isEditing} 
          updateNested={updateNested} 
        />;
      case 'OTHER':
        return <OtherSheet 
          character={character} 
          localData={localData} 
          isEditing={isEditing} 
          updateNested={updateNested} 
        />;
      default:
        return <GenericSheet 
          character={character} 
          localData={localData} 
          isEditing={isEditing} 
          updateNested={updateNested} 
        />;
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isEditing ? onClose : undefined}
            className="absolute inset-0 bg-[#0c0a08]/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a1510] border border-[#c9a84c]/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Window Controls & Actions */}
            <div className="absolute top-6 left-8 flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-900/40 border border-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-900/40 border border-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-900/40 border border-green-500/20" />
              </div>
              <span className="text-[10px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest flex items-center gap-2">
                RP HUB — {isEditing ? 'Editando Lenda' : 'Ficha de Personagem'}
                {character.system === 'DND_5E' && (
                  <span className="flex items-center gap-1 text-[#c9a84c]/60">
                    | MANUAL DO JOGADOR (5E)
                  </span>
                )}
              </span>
            </div>

            <div className="absolute top-6 right-8 flex items-center gap-4 z-10">
              {character.system === 'DND_5E' && (
                <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 mr-4">
                  <button
                    onClick={() => setActivePage('stats')}
                    className={`px-4 py-1.5 rounded-lg font-cinzel text-[9px] font-bold tracking-widest transition-all ${activePage === 'stats' ? 'bg-[#c9a84c] text-[#0c0a08]' : 'text-[#c9a84c]/40 hover:text-[#c9a84c]'}`}
                  >
                    ATRIBUTOS
                  </button>
                  <button
                    onClick={() => setActivePage('spells')}
                    className={`px-4 py-1.5 rounded-lg font-cinzel text-[9px] font-bold tracking-widest transition-all ${activePage === 'spells' ? 'bg-[#c9a84c] text-[#0c0a08]' : 'text-[#c9a84c]/40 hover:text-[#c9a84c]'}`}
                  >
                    MAGIAS
                  </button>
                </div>
              )}

              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#0c0a08] rounded-xl font-cinzel text-[10px] font-bold tracking-widest hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  GRAVAR
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[#c9a84c] rounded-xl font-cinzel text-[10px] font-bold tracking-widest hover:bg-white/10 transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                  EDITAR
                </button>
              )}
              
              <button
                onClick={isEditing ? () => setIsEditing(false) : onClose}
                className="p-2 text-[#4a3820] hover:text-[#c9a84c] transition-colors"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-12">
               {renderSheetContent()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
